'use client';

export function Footer() {
  return (
    <footer className="relative bg-[#07080C]/96 backdrop-blur-md pt-20 pb-12 border-t border-white/[0.14] text-xs font-mono text-[#9DA3AE]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-editorial">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline space-x-2 text-[#F8F9FA]">
              <span className="font-display font-extrabold text-xl tracking-tight uppercase">
                HOPEPITOME
              </span>
              <span className="text-white/30 text-xs font-mono">/</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#9DA3AE] font-semibold">
                DIGITAL SOLUTIONS STUDIO
              </span>
            </div>
            <p className="text-[#D0D4DC] text-xs leading-relaxed max-w-sm font-sans">
              Digital solutions for businesses ready to move forward. We build websites, online stores,
              custom software, and connected systems that help businesses work smarter.
            </p>
            <div className="text-xs text-[#9DA3AE] pt-1 font-mono">
              <span>HOPEPITOME DIGITAL STUDIO</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[#F8F9FA] font-bold block uppercase tracking-wider text-xs">
              WHAT WE BUILD
            </span>
            <ul className="space-y-2 text-xs tracking-wide">
              <li>
                <a href="#services" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Websites &amp; Ecommerce
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Custom Software &amp; Portals
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Workflow Automation
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#D0D4DC] hover:text-white transition-colors">
                  ERP &amp; CRM Systems
                </a>
              </li>
              <li>
                <a href="#transformations" className="text-[#D0D4DC] hover:text-white transition-colors">
                  System Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[#F8F9FA] font-bold block uppercase tracking-wider text-xs">
              THE STUDIO
            </span>
            <ul className="space-y-2 text-xs tracking-wide">
              <li>
                <a href="#hero" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#D0D4DC] hover:text-white transition-colors">
                  About Hopepitome
                </a>
              </li>
              <li>
                <a href="#process" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Our Approach
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Commercial Scoping
                </a>
              </li>
              <li>
                <a href="#faq" className="text-[#D0D4DC] hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[#F8F9FA] font-bold block uppercase tracking-wider text-xs">
              CONTACT
            </span>
            <ul className="space-y-2.5 text-xs tracking-wide">
              <li>
                <span className="text-[#9DA3AE] block text-[11px] font-semibold">DIRECT EMAIL:</span>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="hover:text-white text-[#E8E2FF] transition-colors underline underline-offset-2 font-medium"
                >
                  studio@hopepitome.com
                </a>
              </li>
              <li>
                <span className="text-[#9DA3AE] block text-[11px] font-semibold">INTAKE:</span>
                <a
                  href="mailto:connect.hopepitome@gmail.com"
                  className="hover:text-white text-[#E8E2FF] transition-colors underline underline-offset-2 font-medium"
                >
                  connect.hopepitome@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="#contact"
                  className="text-[#9D85FF] hover:text-white transition-colors font-bold uppercase text-xs flex items-center space-x-1"
                >
                  <span>Have a project in mind? Let&apos;s talk</span>
                  <span>→</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs tracking-wider text-[#9DA3AE] gap-4">
          <div>
            © {new Date().getFullYear()} HOPEPITOME. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#D0D4DC]">BUSINESS TECHNOLOGY &amp; DIGITAL SYSTEMS</span>
            <span className="text-white/20">•</span>
            <span className="text-[#9D85FF] font-semibold">BUILT FOR REAL UTILITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
