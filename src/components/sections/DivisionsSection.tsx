'use client';

export function DivisionsSection() {
  return (
    <section id="divisions" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">03 //</span>
            <span>OUR DIVISIONS</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone">
            BUSINESS SOLUTIONS & CAREER BRANDING
          </div>
        </div>

        {/* Division 01 & Division 02 Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pt-14">
          {/* DIVISION 01: NEXORA (Dark Composition) */}
          <div
            id="nexora"
            className="lg:col-span-6 relative bg-graphite-900 border border-white/10 p-8 sm:p-12 flex flex-col justify-between group overflow-hidden"
          >
            {/* Subtle Graphic Accent */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#1f51ff" strokeWidth="1" strokeDasharray="3 3" />
                <rect x="25" y="25" width="50" height="50" stroke="#c8cbd0" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1f51ff" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-muted-stone mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cobalt-blue inline-block" />
                  <span className="text-warm-white font-bold">DIVISION 01</span>
                </div>
                <span className="text-cobalt-blue">FOR BUSINESSES</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mb-3">
                NEXORA
              </h3>
              <p className="font-mono text-xs text-cobalt-blue tracking-wider uppercase mb-6 font-semibold">
                Digital Solutions for Business
              </p>

              <p className="text-stone-light text-sm sm:text-base leading-relaxed mb-8 font-sans">
                From your first business website to a custom system that supports daily operations, we help you choose, build and improve the digital tools your business needs.
              </p>

              {/* Plain Language Services Breakdown */}
              <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-2 font-bold">
                  WHAT WE BUILD & SUPPORT:
                </span>
                <ul className="space-y-2.5 text-xs font-mono tracking-wide text-stone-light pt-1">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>Business Websites:</strong> Clear, responsive websites built to introduce your company and services.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>Online Stores:</strong> E-commerce shops with product catalogs, shopping carts, and payments.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>Custom Business Software:</strong> Dedicated tools designed around your unique day-to-day operations.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>ERP Systems:</strong> Software to manage purchasing, inventory, sales, and operational records.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>Customer Systems & Automation:</strong> CRMs and automated follow-ups that save your team time.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-cobalt-blue mt-0.5">›</span>
                    <span><strong>Connecting Business Systems:</strong> Linking software and creating clear operational dashboards.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-muted-stone uppercase">
                AUDIENCE: SMALL BUSINESSES TO GROWING COMPANIES
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-warm-white hover:text-cobalt-blue transition-colors font-bold"
              >
                <span>Discuss a business project</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* DIVISION 02: ELEVORA (Clean Paper Editorial Composition) */}
          <div
            id="elevora"
            className="lg:col-span-6 relative bg-[#f4f3ef] text-[#121417] p-8 sm:p-12 flex flex-col justify-between group overflow-hidden border border-[#d8d6cf]"
          >
            {/* Subtle Graphic Accent */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
                <rect x="10" y="10" width="60" height="60" stroke="#121417" strokeWidth="0.75" />
                <line x1="10" y1="30" x2="70" y2="30" stroke="#121417" strokeWidth="0.5" />
                <line x1="10" y1="50" x2="70" y2="50" stroke="#121417" strokeWidth="0.5" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#60656e] mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#121417] inline-block" />
                  <span className="text-[#121417] font-bold">DIVISION 02</span>
                </div>
                <span className="text-[#121417] font-mono font-semibold">FOR INDIVIDUALS</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#121417] tracking-tight uppercase mb-3">
                ELEVORA
              </h3>
              <p className="font-mono text-xs text-[#353942] tracking-wider uppercase mb-6 font-semibold">
                Career Branding & Portfolio Studio
              </p>

              <p className="text-[#363a42] text-sm sm:text-base leading-relaxed mb-8 font-sans">
                We help you present your experience, skills and work clearly through professional career documents, personal websites and online profiles.
              </p>

              {/* Plain Language Services Breakdown */}
              <div className="space-y-3 pt-6 border-t border-[#d5d3cb] mb-8">
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#60656e] block mb-2 font-bold">
                  HOW WE CAN HELP YOUR CAREER:
                </span>
                <ul className="space-y-2.5 text-xs font-mono tracking-wide text-[#2e3239] pt-1">
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>Career Profile & Resume:</strong> Professional CVs formatted clearly for hiring managers and application systems.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>Personal Portfolio Websites:</strong> Showcase your past projects, case studies, and achievements on your own site.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>LinkedIn Profile Improvement:</strong> Make your summary, headline, and experience clear, complete, and engaging.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>Job Search Profile Setup:</strong> Organize your information and profiles across major career portals.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>Tailored Job Applications:</strong> Adapt your materials to highlight genuine strengths for specific roles.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="text-[#121417] font-bold mt-0.5">›</span>
                    <span><strong>Document Updates:</strong> Refresh existing CVs and profiles when entering new roles or transitions.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-[#d5d3cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-[#60656e] uppercase">
                AUDIENCE: STUDENTS, PROFESSIONALS, CAREER CHANGERS & LEADERS
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-[#121417] hover:text-[#1f51ff] font-bold transition-colors"
              >
                <span>Discuss your career profile</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
