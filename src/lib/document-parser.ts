/**
 * UNIVERSAL RESUME DOCUMENT PARSER (PDF, DOCX, TXT)
 * Client- and edge-compatible text extractor using native Web standard DecompressionStream.
 * Handles:
 * - PDF: FlateDecode, ASCII85Decode + FlateDecode, uncompressed streams, text operators (Tj, TJ)
 * - DOCX: ZIP archive extraction of word/document.xml with raw deflate decompression and <w:t> parsing
 * - TXT: UTF-8 decoding
 * - Binary noise suppression and token length safety guards
 */

function decodeAscii85(str: string): Uint8Array {
  // Strip whitespace, delimiters <~ and ~>
  const cleaned = str.replace(/<~|~>|\s/g, '');
  const out: number[] = [];
  let i = 0;
  while (i < cleaned.length) {
    if (cleaned[i] === 'z') {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    let tuple = 0;
    let count = 0;
    for (let j = 0; j < 5; j++) {
      if (i < cleaned.length) {
        const c = cleaned.charCodeAt(i++) - 33;
        tuple = tuple * 85 + c;
        count++;
      } else {
        tuple = tuple * 85 + 84;
      }
    }
    for (let j = 0; j < count - 1; j++) {
      out.push((tuple >> (24 - j * 8)) & 0xff);
    }
  }
  return new Uint8Array(out);
}

async function decompressStream(data: Uint8Array, raw = false): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === 'undefined') {
    return null;
  }
  try {
    const ds = new DecompressionStream(raw ? 'deflate-raw' : 'deflate');
    const writer = ds.writable.getWriter();
    writer.write(data as unknown as BufferSource);
    writer.close();
    const reader = ds.readable.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
    const merged = new Uint8Array(totalLen);
    let off = 0;
    for (const c of chunks) {
      merged.set(c, off);
      off += c.length;
    }
    return merged;
  } catch {
    return null;
  }
}

function decodePdfString(raw: string): string {
  return raw
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\b/g, '')
    .replace(/\\f/g, '')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

export async function extractCleanTextFromDocument(
  buffer: ArrayBuffer,
  fileName: string
): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const lowerName = fileName.toLowerCase();

  // 1. Plain Text (.txt)
  if (lowerName.endsWith('.txt')) {
    return new TextDecoder('utf-8').decode(bytes).trim();
  }

  // 2. Microsoft Word Document (.docx)
  if (lowerName.endsWith('.docx')) {
    try {
      const latin1 = new TextDecoder('latin1').decode(bytes);
      const target = 'word/document.xml';
      const targetOffset = latin1.indexOf(target);
      if (targetOffset !== -1) {
        const pkIdx = latin1.lastIndexOf('PK\x03\x04', targetOffset);
        if (pkIdx !== -1) {
          const view = new DataView(buffer, pkIdx);
          const compMethod = view.getUint16(8, true);
          const compSize = view.getUint32(18, true);
          const fnLen = view.getUint16(26, true);
          const extraLen = view.getUint16(28, true);
          const dataStart = pkIdx + 30 + fnLen + extraLen;
          const compData = bytes.subarray(dataStart, dataStart + compSize);

          let xmlString = '';
          if (compMethod === 0) {
            xmlString = new TextDecoder('utf-8').decode(compData);
          } else if (compMethod === 8) {
            const decomp = await decompressStream(compData, true);
            if (decomp) {
              xmlString = new TextDecoder('utf-8').decode(decomp);
            }
          }

          if (xmlString) {
            // Preserve paragraph structure, tables, and bullet points
            const formattedXml = xmlString
              .replace(/<\/w:p>/gi, '\n')
              .replace(/<\/w:tr>/gi, '\n')
              .replace(/<\/w:tc>/gi, ' | ')
              .replace(/<w:tab\/>/gi, '\t');

            const textNodes: string[] = [];
            const tRegex = /(?:<w:t[^>]*>([\s\S]*?)<\/w:t>|(\n))/gi;
            let m;
            let currentLine = '';
            while ((m = tRegex.exec(formattedXml)) !== null) {
              if (m[2] === '\n') {
                if (currentLine.trim()) textNodes.push(currentLine.trim());
                currentLine = '';
              } else if (m[1]) {
                currentLine += m[1];
              }
            }
            if (currentLine.trim()) textNodes.push(currentLine.trim());
            if (textNodes.length > 0) {
              let joined = textNodes.join('\n').replace(/\n{3,}/g, '\n\n').trim();
              if (joined.length > 8000) joined = joined.substring(0, 8000);
              return joined;
            }
          }
        }
      }
    } catch (err) {
      console.warn('[DOCX Extraction Error]:', err);
    }
  }

  // 3. PDF Document (.pdf)
  if (lowerName.endsWith('.pdf')) {
    try {
      const str = new TextDecoder('latin1').decode(bytes);
      const textPieces: string[] = [];
      let streamPos = 0;

      while ((streamPos = str.indexOf('stream', streamPos)) !== -1) {
        // Handle stream newline variations (\r\n or \n)
        const startOfData =
          str[streamPos + 6] === '\r' && str[streamPos + 7] === '\n'
            ? streamPos + 8
            : str[streamPos + 6] === '\n'
            ? streamPos + 7
            : streamPos + 6;

        const endStreamPos = str.indexOf('endstream', startOfData);
        if (endStreamPos === -1) break;

        const dictStart = str.lastIndexOf('<<', streamPos);
        const dict = dictStart !== -1 ? str.substring(dictStart, streamPos) : '';
        const rawStreamBytes = bytes.subarray(startOfData, endStreamPos);

        const isAscii85 = dict.includes('ASCII85Decode');
        const isFlate = dict.includes('FlateDecode');

        let decompressedBytes: Uint8Array | null = null;
        if (isAscii85) {
          const a85Decoded = decodeAscii85(new TextDecoder('latin1').decode(rawStreamBytes));
          if (isFlate) {
            decompressedBytes =
              (await decompressStream(a85Decoded, false)) ||
              (await decompressStream(a85Decoded, true));
          } else {
            decompressedBytes = a85Decoded;
          }
        } else if (isFlate) {
          decompressedBytes =
            (await decompressStream(rawStreamBytes, false)) ||
            (await decompressStream(rawStreamBytes, true));
        } else {
          decompressedBytes = rawStreamBytes;
        }

        if (decompressedBytes) {
          const content = new TextDecoder('latin1').decode(decompressedBytes);

          // Operator 1: (String) Tj, ', "
          const tjRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*(?:Tj|'|")/g;
          let m;
          while ((m = tjRegex.exec(content)) !== null) {
            const clean = decodePdfString(m[1]).trim();
            if (clean.length > 0 && /[a-zA-Z0-9]/.test(clean)) {
              textPieces.push(clean);
            }
          }

          // Operator 2: [(String) 12 (String)] TJ
          const tjArrRegex = /\[(.*?)\]\s*TJ/g;
          let arr;
          while ((arr = tjArrRegex.exec(content)) !== null) {
            const inRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g;
            let im;
            while ((im = inRegex.exec(arr[1])) !== null) {
              const clean = decodePdfString(im[1]).trim();
              if (clean.length > 0 && /[a-zA-Z0-9]/.test(clean)) {
                textPieces.push(clean);
              }
            }
          }
        }

        streamPos = endStreamPos + 9;
      }

      if (textPieces.length >= 10) {
        let combined = textPieces.join(' ').replace(/\s{2,}/g, ' ').trim();
        // Discard if output looks like binary metadata fragments
        if (!combined.includes('obj') && !combined.includes('endobj') && combined.length > 50) {
          if (combined.length > 8000) combined = combined.substring(0, 8000);
          return combined;
        }
      }
    } catch (err) {
      console.warn('[PDF Stream Extraction Error]:', err);
    }
    // For PDFs where local stream decoding is incomplete or specialized,
    // return empty string so the pipeline feeds the original PDF binary directly to GPT-6 Luna.
    return '';
  }

  return '';
}
