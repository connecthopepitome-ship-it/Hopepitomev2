'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: '1. What information do I need to provide for resume writing?',
    a: 'To get started, you can share your existing resume draft (even if outdated), your updated LinkedIn profile, or notes summarizing your work history, education, certifications, and major accomplishments. If you have target job descriptions you are aiming for, sharing those allows us to align the language and emphasis accurately.',
  },
  {
    q: '2. Can you create a resume for fresh graduates?',
    a: 'Yes. For recent graduates and entry-level professionals, we structure resumes to highlight capstone projects, academic research, relevant coursework, technical proficiencies, internships, and extracurricular leadership to demonstrate real-world competence even with limited formal work history.',
  },
  {
    q: '3. What is ATS resume optimisation?',
    a: 'Applicant Tracking Systems (ATS) are software tools used by corporate recruiters to parse, filter, and organize incoming job applications. Our ATS optimisation involves structuring your resume with standard headings, legible formatting, scannable hierarchies, and authentic keyword relevance matched to your target role. We do not use invisible tricks or guarantee artificial score thresholds, because real-world ATS implementations differ across employers.',
  },
  {
    q: '4. Can you customise my resume for a specific job?',
    a: 'Yes. If you are targeting a specific opening or executive vacancy, we can review the job requirements and tailor your summary, achievement bullets, and skills section to reflect the exact domain priorities and keywords demanded by that role.',
  },
  {
    q: '5. Do you also improve LinkedIn profiles?',
    a: 'Yes. Our LinkedIn Profile Makeover service refactors your headline, About summary, experience entries, and skills matrix. We optimize your profile to project authority, improve search visibility by recruiters, and ensure consistent positioning alongside your resume.',
  },
  {
    q: '6. Can you build a personal portfolio website?',
    a: 'Yes. We design and build clean, fast, and responsive personal portfolio websites. These showcase your case studies, achievements, interactive media, and credentials on an independent domain, giving recruiters and clients tangible proof of your work.',
  },
  {
    q: '7. What does Managed Job Search & Applications include?',
    a: 'This service provides practical, hands-on operational assistance during your job hunt. It includes setting up and refining your job portal profiles, researching and screening relevant vacancies that fit your agreed criteria, preparing application materials, tracking submission statuses, and providing regular progress updates.',
  },
  {
    q: '8. Do you apply for jobs on my behalf?',
    a: 'We provide application assistance, but all job applications are made strictly with your advance knowledge, consent, and approval. We never submit fabricated credentials or apply to unsuitable roles without your sign-off. We also prioritize secure workflows so you retain complete control over your accounts and credentials.',
  },
  {
    q: '9. How many revisions are included?',
    a: 'Every package includes a clearly defined revision allowance (typically 2 to 3 rounds of structured revisions within a 14- to 30-day window following initial draft delivery). This ensures you have ample opportunity to review phrasing, factual accuracy, and design layout before final sign-off.',
  },
  {
    q: '10. How long does delivery take?',
    a: 'Standard turnaround for resume writing and ATS optimisation is typically 3 to 7 business days from the completion of your intake review. Comprehensive packages including custom portfolio websites typically take 8 to 12 business days. If you have an urgent interview or deadline, express delivery options can be agreed during initial scoping.',
  },
  {
    q: '11. Can I purchase individual services?',
    a: 'Yes. You can engage us for any standalone service — such as a single resume rewrite, ATS calibration, a LinkedIn makeover, or a portfolio build — or combine them into a package according to your needs and budget.',
  },
  {
    q: '12. How do I get a quotation?',
    a: 'Simply fill out the consultation enquiry form below, indicating your career stage, the services you need, and any relevant details or target roles. Our team will review your requirements and provide a transparent, itemized quotation with clear deliverables and timelines before any commitment is made.',
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

        {/* Bottom Help Prompt */}
        <div className="mt-12 text-center text-xs text-[#777781] font-mono">
          Have an additional question? Include it in the consultation form below and our team will
          answer it directly.
        </div>
      </div>
    </section>
  );
}

