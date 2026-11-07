const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const targetDir = path.resolve(__dirname, '../src');
const files = getFiles(targetDir);
const iconLibraries = new Set();
const lucideIconsUsed = {};
const filesWithSparkles = [];
const filesWithEmojis = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Check imports
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.includes('from ') && (line.includes('icon') || line.includes('lucide'))) {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      if (match) iconLibraries.add(match[1]);
    }
  });

  // Extract all Lucide imports
  const lucideRegex = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
  let match;
  while ((match = lucideRegex.exec(content)) !== null) {
    const raw = match[1];
    raw.split(',').forEach(item => {
      const clean = item.trim().split(/\s+as\s+/)[0].trim();
      if (clean) {
        lucideIconsUsed[clean] = (lucideIconsUsed[clean] || 0) + 1;
        if (clean === 'Sparkles') {
          filesWithSparkles.push(f);
        }
      }
    });
  }

  // Check emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(content)) {
    filesWithEmojis.push(f);
  }
});

console.log('=== AUDIT RESULTS ===');
console.log('Icon libraries detected:', Array.from(iconLibraries));
console.log('Total distinct Lucide icons:', Object.keys(lucideIconsUsed).length);
console.log('Top Lucide icons used:');
Object.entries(lucideIconsUsed)
  .sort((a,b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([k, v]) => console.log(`  - ${k}: ${v} occurrences`));

console.log('\nFiles importing Sparkles (' + filesWithSparkles.length + '):');
filesWithSparkles.slice(0, 20).forEach(f => console.log('  ', f));

console.log('\nFiles containing Emojis (' + filesWithEmojis.length + '):');
filesWithEmojis.slice(0, 20).forEach(f => console.log('  ', f));

