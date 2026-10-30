import { NextResponse } from 'next/server';
import { validateCareerEnquiry } from '@/lib/career-enquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validateCareerEnquiry(body);

    if (!validation.valid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    // Structured logging for studio enquiry pipeline
    console.log('[CAREER ENQUIRY RECEIVED]', {
      referenceCode: sanitized.referenceCode,
      client: sanitized.fullName,
      email: sanitized.email,
      phone: sanitized.phoneWhatsapp,
      careerStage: sanitized.careerStage,
      serviceRequired: sanitized.serviceRequired,
      targetRole: sanitized.targetRole,
      targetCountry: sanitized.targetCountry,
      contactMethod: sanitized.preferredContactMethod,
      resumeAttachment: sanitized.resumeFileName,
      timestamp: sanitized.createdAt,
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: sanitized.referenceCode,
        message: 'Your career consultation enquiry has been registered successfully. Our specialist team will review your background and get in touch shortly.',
        sanitized: {
          referenceCode: sanitized.referenceCode,
          fullName: sanitized.fullName,
          serviceRequired: sanitized.serviceRequired,
          careerStage: sanitized.careerStage,
          createdAt: sanitized.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API CAREER ENQUIRY ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing career enquiry.' },
      { status: 500 }
    );
  }
}

