'use client';

import React from 'react';
import {
  FileText,
  Search,
  Linkedin,
  Globe,
  Briefcase,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

export function CareerServicesSection() {
  return (
    <section id="services" className="py-24 bg-white border-y border-[#E6E2DC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            OUR CORE DISCIPLINES
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            Everything you need to present yourself professionally.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans">
            From your resume to your online presence and job applications, get practical support at
            every important stage of your career journey.
          </p>
        </div>

        {/* 5 Distinct Service Blocks */}
        <div className="space-y-16">
          {/* Service 01: Resume Crafting */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 md:p-10 transition-all hover:border-[#8172A8]/50 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#8172A8] shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8172A8]">
                    Service 01 · Narrative Architecture
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17243B]">
                  A resume that tells your professional story.
                </h3>

                <p className="text-sm sm:text-base text-[#292D36] leading-relaxed">
                  Your resume should do more than list your previous jobs. We help structure your
                  experience, achievements, skills and qualifications into a clear, professional
                  document that communicates your value.
                </p>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                  >
                    <span>Create My Resume</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6E2DC] p-6 shadow-2xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold mb-3">
                  Included Deliverables
                </h4>
                <ul className="space-y-2.5 text-xs text-[#292D36]">
                  {[
                    'Professional resume writing',
                    'Resume formatting and layout',
                    'Experience and achievement presentation',
                    'Skills and qualifications structuring',
                    'Industry-appropriate resume presentation',
                    'Editable and final document formats (DOCX + PDF)',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Service 02: ATS Resume Optimisation */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 md:p-10 transition-all hover:border-[#8172A8]/50 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#8172A8] shadow-2xs">
                    <Search className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8172A8]">
                    Service 02 · System Compatibility
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17243B]">
                  Make your experience easier to discover and understand.
                </h3>

                <p className="text-sm sm:text-base text-[#292D36] leading-relaxed">
                  Recruitment systems and hiring teams need clear, structured information. We
                  optimise your resume&apos;s content, formatting and keyword relevance against your
                  target role to improve its compatibility with common applicant tracking systems.
                </p>

                {/* Important Technical & Ethical Disclaimer */}
                <div className="bg-[#F7F5F0] border border-[#E6E2DC] rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#777781] leading-relaxed">
                    <strong className="text-[#17243B] font-semibold">Honest standard:</strong> We
                    never promise guaranteed ATS scores, guaranteed shortlisting or guaranteed
                    interviews. Real-world ATS parsing behaviors differ across recruitment
                    platforms, human filter criteria and company configurations. We optimize for
                    clean structure, semantic clarity and authentic keyword relevance.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                  >
                    <span>Optimise My Resume</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6E2DC] p-6 shadow-2xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold mb-3">
                  Included Deliverables
                </h4>
                <ul className="space-y-2.5 text-xs text-[#292D36]">
                  {[
                    'ATS-friendly document structure',
                    'Job-description keyword alignment',
                    'Clear section organisation',
                    'Formatting improvements',
                    'Role-specific content refinement',
                    'Readability and consistency review',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Service 03: LinkedIn Profile Makeover */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 md:p-10 transition-all hover:border-[#8172A8]/50 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#0077B5] shadow-2xs">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8172A8]">
                    Service 03 · Online Presence
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17243B]">
                  Turn your LinkedIn profile into a stronger professional introduction.
                </h3>

                <p className="text-sm sm:text-base text-[#292D36] leading-relaxed">
                  Your LinkedIn profile is often an important part of your professional identity. We
                  help improve how your experience, skills and achievements are presented so your
                  profile communicates a clearer professional story.
                </p>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                  >
                    <span>Improve My LinkedIn Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6E2DC] p-6 shadow-2xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold mb-3">
                  Included Deliverables
                </h4>
                <ul className="space-y-2.5 text-xs text-[#292D36]">
                  {[
                    'Professional headline drafting',
                    'Engaging About section narrative',
                    'Experience description improvements',
                    'Skills and expertise organisation',
                    'Profile presentation recommendations',
                    'Relevant keyword optimisation',
                    'Profile completeness review',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Service 04: Personal Portfolio Development */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 md:p-10 transition-all hover:border-[#8172A8]/50 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#8172A8] shadow-2xs">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8172A8]">
                    Service 04 · Digital Atelier
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17243B]">
                  Give your work a place of its own.
                </h3>

                <p className="text-sm sm:text-base text-[#292D36] leading-relaxed">
                  Showcase your experience, projects, achievements and professional capabilities
                  through a personal website designed around your career and goals.
                </p>

                {/* Portfolio Visual Preview Box */}
                <div className="p-4 bg-white rounded-xl border border-[#E6E2DC] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#777781] pb-2 border-b border-[#E6E2DC]/80">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Live Showcase Architecture</span>
                    </div>
                    <span>Mobile + Desktop Responsive</span>
                  </div>
                  <div className="text-xs text-[#292D36]">
                    Features structured case studies, metrics visualizations, downloadable document
                    repository, and integrated direct contact channel.
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                  >
                    <span>Build My Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6E2DC] p-6 shadow-2xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold mb-3">
                  Included Deliverables
                </h4>
                <ul className="space-y-2.5 text-xs text-[#292D36]">
                  {[
                    'Personal portfolio website build',
                    'Professional introduction section',
                    'Skills and experience timeline',
                    'Project showcase & case study templates',
                    'Certifications and achievements gallery',
                    'Contact section with lead forwarding',
                    'Responsive mobile design & fast performance',
                    'Domain setup, deployment & full handover',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Service 05: Managed Job Search & Applications */}
          <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 md:p-10 transition-all hover:border-[#8172A8]/50 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#8172A8] shadow-2xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8172A8]">
                    Service 05 · Application Operations
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#17243B]">
                  Get organised. Find relevant opportunities. Stay on top of applications.
                </h3>

                <p className="text-sm sm:text-base text-[#292D36] leading-relaxed">
                  Managing a job search can take time. We provide practical assistance with job
                  portal profiles, identifying relevant vacancies, application preparation and
                  tracking your application activity.
                </p>

                {/* Important Service Boundaries & Ethics Card */}
                <div className="bg-[#F7F5F0] border border-[#E6E2DC] rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#17243B]">
                    <Shield className="w-4 h-4 text-[#8172A8]" />
                    <span>Important Service Boundaries & Candidate Consent</span>
                  </div>
                  <p className="text-xs text-[#777781] leading-relaxed">
                    This service provides practical assistance and administrative organization. We
                    do <strong className="text-[#17243B]">not</strong> promise guaranteed
                    employment, guaranteed interviews, guaranteed employer responses, or job offers.
                    All job applications are made strictly with your knowledge and explicit
                    approval. We never fabricate credentials, exaggerate experience, or apply to
                    unsuitable roles.
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8172A8] pt-1">
                    <Lock className="w-3.5 h-3.5 text-[#8172A8]" />
                    <span>Privacy Notice: Candidate passwords & confidential data are strictly safeguarded.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                  >
                    <span>Get Job Search Support</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white rounded-xl border border-[#E6E2DC] p-6 shadow-2xs">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold mb-3">
                  Included Deliverables
                </h4>
                <ul className="space-y-2.5 text-xs text-[#292D36]">
                  {[
                    'Job portal profile setup and improvement',
                    'Profile information management',
                    'Relevant vacancy identification & screening',
                    'Application assistance & document packaging',
                    'Job application tracking database',
                    'Application status organisation',
                    'Follow-up schedule tracking',
                    'Periodic progress reports & consultation updates',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

