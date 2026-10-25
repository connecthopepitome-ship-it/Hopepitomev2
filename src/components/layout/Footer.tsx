'use client';

export function Footer() {
  return (
    <footer className="relative bg-[#07080B]/85 backdrop-blur-md pt-20 pb-12 border-t border-white/[0.08] text-xs font-mono text-muted-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-editorial">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-baseline space-x-2 text-warm-white">
              <span className="font-display font-extrabold text-xl tracking-tight uppercase">
                HOPEPITOME
              </span>
              <span className="text-white/30 text-xs font-mono">/</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-stone">
                DIGITAL SOLUTIONS STUDIO
              </span>
            </div>
            <p className="text-stone-light text-xs leading-relaxed max-w-sm font-sans">
              Digital solutions for businesses ready to move forward. We build websites, online stores,
              custom software, and connected systems that help businesses work smarter.
            </p>
            <div className="text-[11px] text-muted-stone/80 pt-1">
              <span>HOPEPITOME DIGITAL STUDIO</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              WHAT WE BUILD
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Websites &amp; Ecommerce
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Custom Software &amp; Portals
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  Workflow Automation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-warm-white transition-colors">
                  ERP &amp; CRM Systems
                </a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-warm-white transition-colors">
                  System Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              THE STUDIO
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <a href="#hero" className="hover:text-warm-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-warm-white transition-colors">
                  About Hopepitome
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-warm-white transition-colors">
                  Our Approach
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-warm-white transition-colors">
                  Commercial Scoping
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-warm-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-warm-white font-bold block uppercase tracking-wider text-[11px]">
              CONTACT
            </span>
            <ul className="space-y-2 text-[11px] tracking-wide">
              <li>
                <span className="text-muted-stone block text-[10px]">DIRECT EMAIL:</span>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="hover:text-warm-white text-warm-white transition-colors underline underline-offset-2"
                >
                  studio@hopepitome.com
                </a>
              </li>
              <li>
                <span className="text-muted-stone block text-[10px]">INTAKE:</span>
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
                  Have a project in mind? Let&apos;s talk →
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
            <span>BUSINESS TECHNOLOGY &amp; DIGITAL SYSTEMS</span>
            <span>•</span>
            <span className="text-[#8B6CFF]">BUILT FOR REAL UTILITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
