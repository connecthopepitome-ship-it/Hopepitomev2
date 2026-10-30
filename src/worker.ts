import { validateEnquiry, SanitizedEnquiry } from './lib/enquiry';
import { validateCareerEnquiry, SanitizedCareerEnquiry } from './lib/career-enquiry';

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  DB?: {
    prepare: (query: string) => {
      bind: (...args: any[]) => {
        run: () => Promise<any>;
      };
    };
  };
  ENQUIRIES_KV?: {
    put: (key: string, value: string) => Promise<void>;
  };
  ADMIN_EMAIL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Healthcheck endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'hopepitome-v2',
          engine: 'Cloudflare Workers + Edge Assets',
          version: '2.0.0',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 2. Project Enquiry Submission endpoint
    if (url.pathname === '/api/enquiry') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const body = await request.json().catch(() => null);
        const validation = validateEnquiry(body);

        if (!validation.valid || !validation.sanitized) {
          return new Response(
            JSON.stringify({
              success: false,
              errors: validation.errors,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        const enquiry: SanitizedEnquiry = validation.sanitized;

        // Persist to Cloudflare D1 if configured
        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO enquiries (
                id, reference_code, full_name, email, phone_whatsapp, division,
                service_title, requirements, budget_range, desired_timeline,
                attachment_url, consent_given, status, user_agent
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                enquiry.id,
                enquiry.referenceCode,
                enquiry.fullName,
                enquiry.email,
                enquiry.phoneWhatsapp,
                enquiry.division,
                enquiry.serviceTitle,
                enquiry.requirements,
                enquiry.budgetRange,
                enquiry.desiredTimeline,
                enquiry.attachmentUrl,
                enquiry.consentGiven ? 1 : 0,
                enquiry.status,
                request.headers.get('user-agent') || 'Unknown'
              )
              .run();
          } catch (dbErr) {
            console.error('[DB INSERT ERROR]:', dbErr);
            // Fallback continues so client receives receipt
          }
        }

        // Persist to Cloudflare KV if configured
        if (env.ENQUIRIES_KV) {
          try {
            await env.ENQUIRIES_KV.put(
              `enquiry:${enquiry.referenceCode}`,
              JSON.stringify(enquiry)
            );
          } catch (kvErr) {
            console.error('[KV INSERT ERROR]:', kvErr);
          }
        }

        // Log notification event for admin alert dispatch
        const adminRecipient = env.ADMIN_EMAIL || 'studio@hopepitome.com';
        console.log(`[STUDIO DISPATCH NOTICE] New brief registered:`, {
          recipient: adminRecipient,
          reference: enquiry.referenceCode,
          division: enquiry.division,
          service: enquiry.serviceTitle,
          client: enquiry.fullName,
          email: enquiry.email,
          timestamp: enquiry.createdAt,
        });

        return new Response(
          JSON.stringify({
            success: true,
            referenceCode: enquiry.referenceCode,
            message: 'Project brief registered successfully in studio pipeline.',
            sanitized: {
              referenceCode: enquiry.referenceCode,
              fullName: enquiry.fullName,
              division: enquiry.division,
              serviceTitle: enquiry.serviceTitle,
              createdAt: enquiry.createdAt,
            },
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } catch (err: any) {
        console.error('[API ENQUIRY EXCEPTION]:', err);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Internal server error processing enquiry.',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    // 3. Career Services Consultation Enquiry endpoint
    if (url.pathname === '/api/career-enquiry') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const body = await request.json().catch(() => null);
        const validation = validateCareerEnquiry(body);

        if (!validation.valid || !validation.sanitized) {
          return new Response(
            JSON.stringify({
              success: false,
              errors: validation.errors,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }

        const enquiry: SanitizedCareerEnquiry = validation.sanitized;

        // Persist to Cloudflare D1 if configured
        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO career_enquiries (
                id, reference_code, full_name, email, phone_whatsapp,
                career_stage, service_required, target_role, target_country,
                requirements, preferred_contact_method, resume_file_name,
                consent_given, created_at, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                enquiry.id,
                enquiry.referenceCode,
                enquiry.fullName,
                enquiry.email,
                enquiry.phoneWhatsapp,
                enquiry.careerStage,
                enquiry.serviceRequired,
                enquiry.targetRole,
                enquiry.targetCountry,
                enquiry.requirements,
                enquiry.preferredContactMethod,
                enquiry.resumeFileName,
                enquiry.consentGiven ? 1 : 0,
                enquiry.createdAt,
                enquiry.status
              )
              .run();
          } catch (dbErr) {
            console.error('[D1 CAREER INSERT ERROR]:', dbErr);
          }
        }

        // Persist to KV for resilient lookup
        if (env.ENQUIRIES_KV) {
          try {
            await env.ENQUIRIES_KV.put(
              `career_enquiry:${enquiry.referenceCode}`,
              JSON.stringify(enquiry)
            );
          } catch (kvErr) {
            console.error('[KV CAREER INSERT ERROR]:', kvErr);
          }
        }

        const adminRecipient = env.ADMIN_EMAIL || 'careers@hopepitome.com';
        console.log(`[CAREER INTAKE DISPATCH] New career consultation brief:`, {
          recipient: adminRecipient,
          reference: enquiry.referenceCode,
          client: enquiry.fullName,
          email: enquiry.email,
          service: enquiry.serviceRequired,
          stage: enquiry.careerStage,
          timestamp: enquiry.createdAt,
        });

        return new Response(
          JSON.stringify({
            success: true,
            referenceCode: enquiry.referenceCode,
            message: 'Your career consultation enquiry has been registered successfully. Our specialist team will review your background and get in touch shortly.',
            sanitized: {
              referenceCode: enquiry.referenceCode,
              fullName: enquiry.fullName,
              serviceRequired: enquiry.serviceRequired,
              careerStage: enquiry.careerStage,
              createdAt: enquiry.createdAt,
            },
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } catch (err: any) {
        console.error('[API CAREER ENQUIRY EXCEPTION]:', err);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Internal server error processing career enquiry.',
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    // 4. Fallback: Serve static Next.js export assets from ./out
    return env.ASSETS.fetch(request);
  },
};
