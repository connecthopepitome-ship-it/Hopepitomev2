'use client';

export function Footer() {
  return (
    <footer className="relative bg-[#07080B]/85 backdrop-blur-md pt-20 pb-12 border-t border-white/[0.08] text-xs font-mono text-muted-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-editorial">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline space-x-2 text-warm-white">
              <span className="font-display font-bold text-xl tracking-tight uppercase">
                HOPEPITOME
              </span>
              <span className="text-white/30 text-xs font-mono">/</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-stone">
                DIGITAL STUDIO
              </span>
            </div>
            <p className="text-stone-light text-xs leading-relaxed max-w-sm font-sans">
              We build practical websites and business software through <strong>Nexora</strong>, and help individuals present their skills and career achievements with confidence through <strong>Elevora</strong>.
            </p>
            <div className="text-[11px] text-muted-stone/80 pt-1">
              <span>HOPEPITOME DIGITAL STUDIO</span>
            </div>
          </div>

          {/* Division 01 Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              01 // BUSINESS (NEXORA)
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Business Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Online Stores & Shops
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Custom Software
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  ERP & Operations
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Customer Management (CRM)
                </a>
              </li>
            </ul>
          </div>

          {/* Division 02 Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              02 // CAREER (ELEVORA)
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Career Profile & Resumes
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Portfolio Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  LinkedIn Profile Updates
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Job Portal Profiles
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Tailored Applications
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              GET IN TOUCH
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <span className="text-muted-stone block text-[10px]">EMAIL INQUIRIES:</span>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="hover:text-warm-white text-warm-white transition-colors underline underline-offset-2"
                >
                  studio@hopepitome.com
                </a>
              </li>
              <li>
                <span className="text-muted-stone block text-[10px]">DIRECT INTAKE:</span>
                <a
                  href="mailto:connect.hopepitome@gmail.com"
                  className="hover:text-warm-white text-stone-light transition-colors"
                >
                  connect.hopepitome@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="#contact"
                  className="text-[#8B6CFF] hover:text-[#E4DBFF] transition-colors font-bold uppercase text-[11px]"
                >
                  Tell Us What You Need →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider text-muted-stone/70 gap-4">
          <div>
            © {new Date().getFullYear()} HOPEPITOME. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-4">
            <span>TAILORED DIGITAL SOLUTIONS</span>
            <span>•</span>
            <span className="text-[#8B6CFF]">CRAFTED FOR REAL IMPACT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
