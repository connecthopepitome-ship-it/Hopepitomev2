'use client';

import React from 'react';
import { MessageSquare, Compass, Code2, Rocket } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Tell us your idea.',
    description: 'Share your business goals or manual headache in plain English. No technical jargon required.',
    icon: MessageSquare,
    color: '#7357F5',
  },
  {
    step: '02',
    title: 'We plan the solution.',
    description: 'We outline the architecture, clear deliverables, timeline, and a fixed price upfront.',
    icon: Compass,
    color: '#48C7E8',
  },
  {
    step: '03',
    title: 'We build and test it.',
    description: 'We develop your system, test it thoroughly on phones and desktops, and keep you in the loop.',
    icon: Code2,
    color: '#9B6BFF',
  },
  {
    step: '04',
    title: 'You launch and use it.',
    description: 'We deploy your system to fast cloud servers and support you with maintenance as you grow.',
    icon: Rocket,
    color: '#65DDB5',
  },
];

export function ProcessSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#0A0C14]/90 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-[#65DDB5]">
            <span>Clear &amp; Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Four simple steps from your first idea to a live business system.
          </p>
        </div>

        {/* 4 Simple Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-[#121520]/80 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between backdrop-blur-md shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-white/20">
                      {s.step}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${s.color}15`, color: s.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ProcessSection;
