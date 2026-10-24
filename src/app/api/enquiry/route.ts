import { NextResponse } from 'next/server';
import { validateEnquiry } from '@/lib/enquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validateEnquiry(body);

    if (!validation.valid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    // Log admin notification event
    console.log('[ENQUIRY RECEIVED]', {
      referenceCode: sanitized.referenceCode,
      client: sanitized.fullName,
      email: sanitized.email,
      division: sanitized.division,
      service: sanitized.serviceTitle,
      timestamp: sanitized.createdAt,
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: sanitized.referenceCode,
        message: 'Project brief registered successfully in studio pipeline.',
        sanitized: {
          referenceCode: sanitized.referenceCode,
          fullName: sanitized.fullName,
          division: sanitized.division,
          serviceTitle: sanitized.serviceTitle,
          createdAt: sanitized.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API ENQUIRY ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing brief.' },
      { status: 500 }
    );
  }
}
