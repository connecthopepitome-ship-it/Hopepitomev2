'use client';

export function DivisionsSection() {
  return (
    <section id="divisions" className="relative py-28 md:py-36 border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-white/[0.08] gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">03 //</span>
            <span className="text-warm-white">TWO DEDICATED DIVISIONS</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone">
            BUSINESS SYSTEMS &amp; CAREER BRANDING
          </div>
        </div>

        {/* Division 01 & Division 02 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pt-14">
          {/* DIVISION 01: NEXORA (Digital Engineering) */}
          <div
            id="nexora"
            className="lg:col-span-6 relative bg-[#101116]/60 border border-white/[0.08] hover:border-[#8B6CFF]/40 p-8 sm:p-12 flex flex-col justify-between group overflow-hidden backdrop-blur-md transition-all duration-300"
          >
            {/* Subtle Architectural Grid Accent */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#8B6CFF" strokeWidth="1" strokeDasharray="3 3" />
                <rect x="25" y="25" width="50" height="50" stroke="#E4DBFF" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#8B6CFF" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-muted-stone mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#8B6CFF] inline-block" />
                  <span className="text-warm-white font-bold">DIVISION 01</span>
                </div>
                <span className="text-[#8B6CFF] font-semibold">FOR BUSINESSES</span>
              </div>

              {/* Title & Prompt Subtitle */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mb-2">
                NEXORA
              </h3>
              <p className="font-mono text-xs text-[#E4DBFF] tracking-wider uppercase mb-5 font-semibold">
                Nexora — Digital Engineering
              </p>

              <blockquote className="text-stone-light text-sm sm:text-base leading-relaxed mb-8 font-sans border-l-2 border-[#8B6CFF]/40 pl-4 italic">
                “Websites, online stores and business software built around the way you work.”
              </blockquote>

              {/* 6 Required Core Services */}
              <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-3 font-bold">
                  CORE SERVICES:
                </span>
                <ul className="space-y-3 text-xs font-mono tracking-wide text-stone-light">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Business websites:</strong> Fast, accessible web presence designed to communicate your value and convert enquiries.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Ecommerce websites:</strong> Complete online shopping systems with inventory, checkout, and payments.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Custom software:</strong> Tailored web platforms and applications addressing specific business bottlenecks.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">ERP and CRM systems:</strong> Operations management, inventory, sales pipelines, and customer relationship software.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Workflow automation:</strong> Reducing manual admin and repetitive tasks with seamless background workflows.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#8B6CFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">System integrations:</strong> Connecting your APIs, payment gateways, accounting systems, and external tools.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-muted-stone uppercase">
                TARGET: GROWING COMPANIES &amp; OPERATORS
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-warm-white hover:text-[#8B6CFF] transition-colors font-bold"
              >
                <span>Discuss a business system</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* DIVISION 02: ELEVORA (Career Branding) */}
          <div
            id="elevora"
            className="lg:col-span-6 relative bg-[#101116]/60 border border-white/[0.08] hover:border-[#E4DBFF]/40 p-8 sm:p-12 flex flex-col justify-between group overflow-hidden backdrop-blur-md transition-all duration-300"
          >
            {/* Subtle Architectural Grid Accent */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="20" width="60" height="60" stroke="#E4DBFF" strokeWidth="1" />
                <line x1="20" y1="40" x2="80" y2="40" stroke="#8B6CFF" strokeWidth="0.75" />
                <line x1="20" y1="60" x2="80" y2="60" stroke="#8B6CFF" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-muted-stone mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#E4DBFF] inline-block" />
                  <span className="text-warm-white font-bold">DIVISION 02</span>
                </div>
                <span className="text-[#E4DBFF] font-semibold">FOR INDIVIDUALS</span>
              </div>

              {/* Title & Prompt Subtitle */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mb-2">
                ELEVORA
              </h3>
              <p className="font-mono text-xs text-[#8B6CFF] tracking-wider uppercase mb-5 font-semibold">
                Elevora — Career Branding
              </p>

              <blockquote className="text-stone-light text-sm sm:text-base leading-relaxed mb-8 font-sans border-l-2 border-[#E4DBFF]/40 pl-4 italic">
                “Present your experience clearly, build your professional presence and prepare for your next opportunity.”
              </blockquote>

              {/* 5 Required Core Services */}
              <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-3 font-bold">
                  CORE SERVICES:
                </span>
                <ul className="space-y-3 text-xs font-mono tracking-wide text-stone-light">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#E4DBFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Resume writing:</strong> Clear, high-impact CVs structured for hiring managers and modern applicant tracking systems.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#E4DBFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">LinkedIn profile improvement:</strong> Headline, summary, experience, and recommendations optimized to stand out.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#E4DBFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Personal portfolio websites:</strong> Custom web domains and portfolios to display case studies, writing, or designs.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#E4DBFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Job portal profile support:</strong> Consistent, polished presence across relevant talent platforms and industry job boards.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#E4DBFF] mt-0.5">›</span>
                    <span>
                      <strong className="text-warm-white">Tailored job applications:</strong> Targeted cover letters and position-specific application materials highlighting authentic capability.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-muted-stone uppercase">
                TARGET: PROFESSIONALS, LEADERS &amp; CAREER CHANGERS
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-warm-white hover:text-[#E4DBFF] transition-colors font-bold"
              >
                <span>Elevate your career profile</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DivisionsSection;
