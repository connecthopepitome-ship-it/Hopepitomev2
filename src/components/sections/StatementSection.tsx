'use client';

export function StatementSection() {
  return (
    <section id="statement" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Index Marker */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono tracking-widest text-muted-stone uppercase">
          <span className="text-cobalt-blue font-bold">02 //</span>
          <span>OUR APPROACH</span>
        </div>

        {/* Large Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-warm-white uppercase">
              TECHNOLOGY
              <br />
              FOR BUSINESS.
              <br />
              <span className="text-silver">DESIGN FOR PEOPLE.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:border-l lg:border-editorial lg:pl-10">
            <p className="text-warm-white text-base sm:text-lg leading-relaxed font-sans">
              Every business has its own way of working, and every person has a story worth presenting well.
            </p>
            <p className="text-stone-light text-sm sm:text-base leading-relaxed font-sans">
              Hopepitome helps businesses build the digital tools they need and helps individuals communicate their skills and experience with confidence.
            </p>

            <div className="pt-4 border-t border-editorial grid grid-cols-2 gap-4 text-xs font-mono tracking-wider uppercase">
              <div>
                <span className="text-cobalt-blue block text-[10px] font-bold">FOR BUSINESS</span>
                <span className="text-warm-white font-semibold">Nexora Solutions</span>
              </div>
              <div>
                <span className="text-stone-light block text-[10px] font-bold">FOR INDIVIDUALS</span>
                <span className="text-warm-white font-semibold">Elevora Studio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
