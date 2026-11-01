'use client';

import React from 'react';
import { Layers, FileText, Send, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Choose your service',
    description: 'Select the exact career disciplines you need—from professional resume writing to complete LinkedIn or portfolio redesign.',
    icon: Layers,
    color: '#7357F5',
  },
  {
    number: '02',
    title: 'Share your details',
    description: 'Upload your current resume or provide a brief overview of your career trajectory and target job market. All fields are flexible.',
    icon: FileText,
    color: '#48C7E8',
  },
  {
    number: '03',
    title: 'Get reviewed and receive your proposal',
    description: 'Our lead career consultant reviews your background and delivers a bespoke project proposal with clear timelines within 2 hours.',
    icon: Send,
    color: '#65DDB5',
  },
];

export function CareerProcessSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#FAF8FF] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7357F5] bg-[#7357F5]/10 px-3 py-1 rounded-full">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17152F] tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Three straightforward steps to transform your career presence.
          </p>
        </div>

        {/* 3 Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#7357F5]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl sm:text-3xl font-black text-[#17152F]/20 font-mono tracking-tight">
                      {step.number}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#17152F] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#7357F5]">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
