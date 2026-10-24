'use client';

import { useState } from 'react';

export function FinalCtaSection() {
  const [division, setDivision] = useState<'NEXORA' | 'ELEVORA' | 'BOTH'>('NEXORA');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-32 border-b border-editorial overflow-hidden">
      {/* Background Editorial Grid */}
      <div className="absolute inset-0 editorial-grid-fine opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase mb-16">
          <span className="text-cobalt-blue font-bold">08 //</span>
          <span>INITIATE ENGAGEMENT</span>
        </div>

        {/* Large Editorial Headline */}
        <div className="mb-20">
          <h2 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-9xl tracking-tight leading-[0.9] text-warm-white uppercase">
            LET&apos;S MAKE
            <br />
            SOMETHING
            <br />
            <span className="text-silver">MATTER.</span>
          </h2>
        </div>

        {/* Project Enquiry Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-editorial">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="tech-label">[ ENGAGEMENT PARAMETERS ]</span>
              <p className="text-stone-light text-base leading-relaxed mt-4 mb-6 font-sans">
                Tell us about your digital infrastructure needs or executive branding ambitions. Our principals review all enquiries within one business cycle.
              </p>
              <div className="space-y-2 text-xs font-mono text-muted-stone uppercase">
                <div className="flex items-center space-x-2">
                  <span className="text-cobalt-blue">●</span>
                  <span>ESTIMATED LEAD TIME: 1–2 WEEKS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cobalt-blue">●</span>
                  <span>DIRECT PRINCIPAL CONSULTATION</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cobalt-blue">●</span>
                  <span>CONFIDENTIAL & NDA COMPLIANT</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/[0.08] text-xs font-mono text-muted-stone">
              <span>DIRECT CONTACT: </span>
              <a
                href="mailto:studio@hopepitome.com"
                className="text-warm-white hover:text-cobalt-blue transition-colors underline underline-offset-4"
              >
                studio@hopepitome.com
              </a>
            </div>
          </div>

          {/* Clean Editorial Form */}
          <div className="lg:col-span-7 bg-graphite-900 border border-editorial p-8 sm:p-10">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <span className="w-3 h-3 rounded-full bg-cobalt-blue inline-block animate-ping" />
                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-warm-white">
                  TRANSMISSION RECEIVED
                </h3>
                <p className="text-stone-light text-sm max-w-md mx-auto">
                  Your project brief has been logged into our intake pipeline. A studio principal will contact you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-mono tracking-widest uppercase text-cobalt-blue hover:text-warm-white"
                >
                  ← SUBMIT ANOTHER ENQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Division Selector */}
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-3">
                    SELECT DIVISION / CAPABILITY
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['NEXORA', 'ELEVORA', 'BOTH'] as const).map((div) => (
                      <button
                        key={div}
                        type="button"
                        onClick={() => setDivision(div)}
                        className={`py-2.5 px-3 text-xs font-mono tracking-widest uppercase border transition-all text-center ${
                          division === div
                            ? 'border-cobalt-blue bg-cobalt-blue/15 text-warm-white'
                            : 'border-white/10 bg-transparent text-muted-stone hover:border-white/30'
                        }`}
                      >
                        {div === 'BOTH' ? 'COMBINED' : div}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="client-email"
                    className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-2"
                  >
                    WORK EMAIL / CONTACT
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full bg-graphite-950 border border-white/10 px-4 py-3 text-warm-white font-mono text-sm placeholder:text-muted-stone/40 focus:outline-none focus:border-cobalt-blue"
                  />
                </div>

                {/* Brief Notes */}
                <div>
                  <label
                    htmlFor="client-brief"
                    className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-2"
                  >
                    BRIEF PROJECT OVERVIEW / OBJECTIVES
                  </label>
                  <textarea
                    id="client-brief"
                    rows={4}
                    required
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Describe your current system requirements, project scope, or career branding goals..."
                    className="w-full bg-graphite-950 border border-white/10 px-4 py-3 text-warm-white font-sans text-sm placeholder:text-muted-stone/40 focus:outline-none focus:border-cobalt-blue resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-graphite-950 hover:bg-cobalt-blue hover:text-white transition-colors duration-300 font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center space-x-2"
                >
                  <span>SUBMIT PROJECT BRIEF</span>
                  <span>↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
