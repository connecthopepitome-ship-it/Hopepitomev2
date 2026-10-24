'use client';

export function DivisionsSection() {
  return (
    <section id="divisions" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">03 //</span>
            <span>DIVISIONS</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-muted-stone">
            TWO DISTINCT CAPABILITIES // ONE UNIFIED STUDIO
          </div>
        </div>

        {/* Division 01 & Division 02 Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pt-16">
          {/* DIVISION 01: NEXORA (Dark Technical Composition) */}
          <div
            id="nexora"
            className="lg:col-span-6 relative bg-graphite-900 border border-white/10 p-8 sm:p-12 flex flex-col justify-between group overflow-hidden"
          >
            {/* Technical Schematic Background Accent */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="#1f51ff" strokeWidth="1" strokeDasharray="3 3" />
                <rect x="25" y="25" width="50" height="50" stroke="#c8cbd0" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1f51ff" strokeWidth="0.75" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="#1f51ff" strokeWidth="0.75" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-muted-stone mb-8">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cobalt-blue inline-block" />
                  <span className="text-warm-white font-bold">DIVISION 01</span>
                </div>
                <span className="text-cobalt-blue">NXR_SYS.01</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mb-4">
                NEXORA
              </h3>
              <p className="font-mono text-xs text-cobalt-blue tracking-widest uppercase mb-8">
                DIGITAL ENGINEERING & ENTERPRISE ARCHITECTURE
              </p>

              <p className="text-stone-light text-sm sm:text-base leading-relaxed mb-10 font-sans">
                High-performance web applications, robust ERP installations, mission-critical business automation, and enterprise integration pipelines engineered for operational superiority.
              </p>

              {/* Technical Services Breakdown */}
              <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-10">
                <span className="tech-label">[ CAPABILITIES SPECTRUM ]</span>
                <ul className="space-y-2 text-xs font-mono tracking-wider text-muted-stone uppercase pt-2">
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>Business Website & Web Application Engineering</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>E-Commerce & High-Volume Commerce Systems</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>Custom Enterprise Software Development</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>ERP Implementation, Customization & Consulting</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>CRM & Business Process Automation</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>Business Portals, Dashboards & Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-warm-white transition-colors">
                    <span className="text-cobalt-blue">›</span>
                    <span>API Integrations & System Modernization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-stone uppercase">
                TARGET: ENTERPRISES & SCALE-UPS
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-warm-white hover:text-cobalt-blue transition-colors group-hover:translate-x-1"
              >
                <span>INITIATE NEXORA PROJECT</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* DIVISION 02: ELEVORA (Lighter Editorial Composition) */}
          <div
            id="elevora"
            className="lg:col-span-6 relative bg-[#f2f1ed] text-[#0e1013] p-8 sm:p-12 flex flex-col justify-between group overflow-hidden border border-[#d8d6cf]"
          >
            {/* Paper Texture Accent / Minimal Grid */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-25">
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
                <rect x="10" y="10" width="60" height="60" stroke="#0e1013" strokeWidth="0.75" />
                <line x1="10" y1="30" x2="70" y2="30" stroke="#0e1013" strokeWidth="0.5" />
                <line x1="10" y1="50" x2="70" y2="50" stroke="#0e1013" strokeWidth="0.5" />
              </svg>
            </div>

            <div>
              {/* Division Header */}
              <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[#5a5e66] mb-8">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#0e1013] inline-block" />
                  <span className="text-[#0e1013] font-bold">DIVISION 02</span>
                </div>
                <span className="text-[#0e1013] font-mono">ELV_STUDIO.02</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0e1013] tracking-tight uppercase mb-4">
                ELEVORA
              </h3>
              <p className="font-mono text-xs text-[#3b4049] tracking-widest uppercase mb-8">
                CAREER STUDIO & EXECUTIVE IDENTITY ATELIER
              </p>

              <p className="text-[#33373e] text-sm sm:text-base leading-relaxed mb-10 font-sans">
                Curating definitive career positioning for senior executives, technical leaders, and ambitious specialists. Transformative CV craftsmanship, bespoke portfolio design, and LinkedIn authority.
              </p>

              {/* Career Studio Breakdown */}
              <div className="space-y-3 pt-6 border-t border-[#d5d3cb] mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#696d75]">
                  [ ATELIER SERVICES ]
                </span>
                <ul className="space-y-2 text-xs font-mono tracking-wider text-[#3d424b] uppercase pt-2">
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>Executive Resume & Curriculum Vitae Architecture</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>Bespoke Personal Portfolio Website Development</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>LinkedIn Profile Optimization & Presence Overhaul</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>Job Portal & Executive Network Profile Management</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>Comprehensive Resume Revisions & Strategic Refinement</span>
                  </li>
                  <li className="flex items-center space-x-2 hover:text-[#0e1013] transition-colors">
                    <span className="text-[#0e1013] font-bold">›</span>
                    <span>Job-Specific Targeting & ATS Calibration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Division Link */}
            <div className="pt-6 border-t border-[#d5d3cb] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#696d75] uppercase">
                TARGET: LEADERS & HIGH-CALIBER PROFESSIONALS
              </span>
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-[#0e1013] hover:text-[#1f51ff] font-bold transition-colors group-hover:translate-x-1"
              >
                <span>BOOK CAREER ATELIER</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
