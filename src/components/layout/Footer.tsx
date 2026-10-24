'use client';

export function Footer() {
  return (
    <footer className="relative bg-graphite-950 pt-20 pb-12 border-t border-editorial text-xs font-mono text-muted-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-editorial">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline space-x-2 text-warm-white">
              <span className="font-display font-extrabold text-xl tracking-tight uppercase">
                HOPEPITOME
              </span>
              <span className="text-white/30 text-xs font-mono">/</span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-stone">
                DIGITAL STUDIO
              </span>
            </div>
            <p className="text-stone-light text-xs leading-relaxed max-w-sm font-sans">
              An independent digital studio operating at the nexus of enterprise software architecture (Nexora) and executive career narrative positioning (Elevora).
            </p>
            <div className="text-[11px] text-muted-stone/80 pt-2">
              <span>EST. 2026 // RELEASE 2.0</span>
            </div>
          </div>

          {/* Division 01 Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-widest text-[11px]">
              01 // NEXORA
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide uppercase">
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Web Applications
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Commerce Engines
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  ERP & Frappe
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Custom Software
                </a>
              </li>
            </ul>
          </div>

          {/* Division 02 Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-widest text-[11px]">
              02 // ELEVORA
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide uppercase">
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Executive Resumes
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Personal Portfolios
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  LinkedIn Optimization
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  ATS Calibration
                </a>
              </li>
            </ul>
          </div>

          {/* Studio & Legal */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-widest text-[11px]">
              COMMUNICATIONS
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="hover:text-warm-white transition-colors underline underline-offset-2"
                >
                  studio@hopepitome.com
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-warm-white transition-colors"
                >
                  Project Inquiries →
                </a>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-muted-stone/60 uppercase block">
                  TERMS // PRIVACY // ETHICAL CODE
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-widest uppercase text-muted-stone/70 gap-4">
          <div>
            © {new Date().getFullYear()} HOPEPITOME. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <span>NO AI-GENERATED TEMPLATES</span>
            <span>•</span>
            <span className="text-cobalt-blue">CRAFTED WITH PRECISION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
