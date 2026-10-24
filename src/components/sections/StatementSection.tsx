'use client';

export function StatementSection() {
  return (
    <section id="statement" className="relative py-28 md:py-36 border-b border-editorial overflow-hidden">
      {/* Background Editorial Markers */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Index Marker */}
        <div className="flex items-center space-x-3 mb-12 text-xs font-mono tracking-widest text-muted-stone uppercase">
          <span className="text-cobalt-blue font-bold">02 //</span>
          <span>STUDIO STATEMENT</span>
        </div>

        {/* Large Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-warm-white uppercase">
              TECHNOLOGY
              <br />
              FOR BUSINESS.
              <br />
              <span className="text-muted-stone">DESIGN FOR</span>
              <br />
              <span className="text-silver">PEOPLE.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end space-y-8 lg:border-l lg:border-editorial lg:pl-10">
            <div className="space-y-4">
              <span className="tech-label">[ THE THESIS ]</span>
              <p className="text-stone-light text-base leading-relaxed">
                Most agencies treat digital software as an isolated utility and personal
                branding as an afterthought. Hopepitome unifies both disciplines.
              </p>
              <p className="text-muted-stone text-sm leading-relaxed">
                We engineer reliable, scalable web systems and business workflows through
                <strong className="text-warm-white font-medium"> Nexora</strong>, and sculpt distinctive, professional career identities and portfolios through
                <strong className="text-warm-white font-medium"> Elevora</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-editorial grid grid-cols-2 gap-4 text-xs font-mono tracking-widest uppercase">
              <div>
                <span className="text-muted-stone block text-[10px]">PARADIGM</span>
                <span className="text-warm-white font-bold">DUAL-DISCIPLINE</span>
              </div>
              <div>
                <span className="text-muted-stone block text-[10px]">EXECUTION</span>
                <span className="text-warm-white font-bold">TAILORED CRAFT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
