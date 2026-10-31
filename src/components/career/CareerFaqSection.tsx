'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: '1. What information do I need to provide for resume writing?',
    a: 'To get started, you can share your existing resume draft (even if outdated), your LinkedIn profile, or notes summarizing your work history, education, certifications, and major accomplishments. If you have specific target job descriptions you are aiming for, sharing those allows us to align the language and emphasis accurately.',
  },
  {
    q: '2. Can you create a resume for fresh graduates?',
    a: 'Yes. For recent graduates and early-career candidates, we structure resumes to highlight capstone projects, academic research, relevant coursework, technical tools, internships, and extracurricular leadership to demonstrate practical capability.',
  },
  {
    q: '3. What is ATS resume optimisation?',
    a: 'Applicant Tracking Systems (ATS) are software tools used by corporate recruiters to parse, filter, and organize incoming job applications. Our ATS optimisation involves structuring your resume with standard headings, legible formatting, scannable hierarchies, and relevant keywords matched to your target role. We do not promise artificial score thresholds or guaranteed shortlisting, because real-world ATS implementations differ across employers.',
  },
  {
    q: '4. Can you customise my resume for a specific job?',
    a: 'Yes. If you are targeting a specific vacancy or role, we can review the job requirements and tailor your summary, experience points, and skills section to reflect the priorities and keywords of that position.',
  },
  {
    q: '5. Do you also improve LinkedIn profiles?',
    a: 'Yes. Our LinkedIn Profile Makeover service refactors your headline, About summary, experience entries, and skills list. We optimize your profile so it communicates a clear professional story and stays consistent with your resume.',
  },
  {
    q: '6. Can you build a personal portfolio website?',
    a: 'Yes. We design and build clean, fast, and responsive personal portfolio websites. These showcase your case studies, projects, credentials, and achievements on an independent domain, giving recruiters and clients a dedicated place to see your work.',
  },
  {
    q: '7. What does Managed Job Search & Applications include?',
    a: 'This service provides practical assistance during your job search. It includes setting up and updating job portal profiles, identifying relevant vacancies matching your agreed criteria, preparing application documents, and maintaining a centralized tracking sheet to monitor status and follow-ups.',
  },
  {
    q: '8. Do you apply for jobs on my behalf?',
    a: 'We provide application assistance, but every application is submitted strictly with your advance knowledge, consent, and approval. We never submit inaccurate information, fabricate credentials, or apply to unsuitable roles without your sign-off.',
  },
  {
    q: '9. How many revisions are included?',
    a: 'Every package includes a clearly defined revision allowance (2 to 3 structured rounds within a 14- to 30-day window following draft delivery). We do not offer open-ended or unlimited revisions, ensuring focused feedback and clear milestone completion.',
  },
  {
    q: '10. How long does delivery take?',
    a: 'Standard turnaround for resume writing and ATS optimisation is typically 3 to 7 business days from the review of your requirements. Comprehensive packages including custom portfolio websites typically take 8 to 12 business days.',
  },
  {
    q: '11. Can I purchase individual services?',
    a: 'Yes. You can engage us for any standalone service — such as a single resume rewrite, ATS optimisation, a LinkedIn makeover, or a portfolio website — or combine services into a package based on your goals.',
  },
  {
    q: '12. How do I get a quotation?',
    a: 'Simply fill out the enquiry form below, indicating your career stage, the service you need, and any relevant details. Our team typically reviews submissions and responds with a transparent, itemized quotation within 1–2 business days before any commitment is made.',
  },
];

export function CareerFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 bg-[#F7F5F0] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            Clear answers to common questions.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Everything you need to know about our scope, timelines, revisions, and collaboration
            standards before getting started.
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E6E2DC] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full py-5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#8172A8] transition-colors hover:bg-[#FAF8FC]"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-[#17243B]">
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-[#FAF8FC] border border-[#E6E2DC] text-[#8172A8] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#F2EFF7]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 border-t border-[#E6E2DC]/60 text-sm text-[#292D36]/85 leading-relaxed bg-[#FAF8FC]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Document Retention & Privacy Note */}
        <div className="mt-12 text-center text-xs text-[#777781] font-sans max-w-2xl mx-auto">
          <strong>Document Privacy:</strong> Your resumes, work notes, and contact details are kept
          strictly confidential and will not be shared with third parties or external databases. You
          can request deletion of your submitted files at any time.
        </div>
      </div>
    </section>
  );
}
