'use client';

import { useState } from 'react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'Do you only build websites?',
    a: 'No. We build business websites, online stores, custom web applications, internal tools, workflow automation and connected business systems.',
  },
  {
    id: 'faq-2',
    q: 'Can you build an affordable website for a small business?',
    a: 'Yes. We can scope a website around the features your business needs now, then discuss optional additions separately. The final fee depends on the agreed scope.',
  },
  {
    id: 'faq-3',
    q: 'Do I have to pay a monthly subscription?',
    a: 'Our project development work can be priced as a one-time fee for an agreed scope. Domain renewals, hosting, paid platforms, third-party APIs and optional maintenance may have separate ongoing charges. We explain applicable costs before you approve the project.',
  },
  {
    id: 'faq-4',
    q: 'Can you build my own online shopping website?',
    a: 'Yes. We can discuss product catalogues, product variants, shopping carts, payments, orders and shipping integrations according to your requirements.',
  },
  {
    id: 'faq-5',
    q: 'Can you build software specifically for my business?',
    a: 'Yes. We first understand your process and then recommend whether a custom application, an existing platform or an integration is the most practical approach.',
  },
  {
    id: 'faq-6',
    q: 'Can you automate my existing work?',
    a: 'Potentially, yes. We review the task, the tools you already use and the available integration options before recommending an automation.',
  },
  {
    id: 'faq-7',
    q: 'Do I need an ERP system?',
    a: 'Not necessarily. Some businesses need a simple CRM, inventory tool or workflow application. We help you identify the appropriate level of solution before committing to a larger system.',
  },
  {
    id: 'faq-8',
    q: 'Can you improve an existing website or application?',
    a: 'Yes. We can assess the current setup and determine whether targeted improvements, integration work or a more substantial redesign is appropriate.',
  },
  {
    id: 'faq-9',
    q: 'How do I get a quotation?',
    a: 'Share your goals and the features you have in mind. We will clarify the scope and provide a proposal based on the information available.',
  },
];

export function FaqSection() {
  const [openItem, setOpenItem] = useState<string | null>(faqs[0].id);

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">09 //</span>
            <span className="text-warm-white">FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] inline-block shadow-[0_0_8px_#8B6CFF]" />
            <span>STRAIGHTFORWARD ANSWERS FOR BUSINESSES</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-4">
            QUESTIONS YOU MAY HAVE.
          </h2>
          <p className="text-stone-light text-base leading-relaxed font-sans">
            Clear information on our capabilities, pricing philosophy, and collaboration model so you can
            make informed decisions for your business.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 max-w-4xl">
          {faqs.map((faq) => {
            const isOpen = openItem === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#101116]/60 backdrop-blur-md border border-white/[0.08] transition-colors hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-warm-white uppercase tracking-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-sm text-[#8B6CFF] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm font-sans text-stone-light leading-relaxed border-t border-white/[0.04]">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Text */}
        <div className="mt-10 p-5 bg-[#101116]/40 border border-white/[0.08] max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-muted-stone">
          <span>Have a question not listed here?</span>
          <a
            href="#contact"
            className="text-[#8B6CFF] hover:text-white transition-colors uppercase font-bold"
          >
            Ask us directly in the form below →
          </a>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
