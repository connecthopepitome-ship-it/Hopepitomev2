'use client';

import React from 'react';
import { UserCheck, Sparkles, ShieldCheck } from 'lucide-react';

const WHY_POINTS = [
  {
    icon: UserCheck,
    title: 'Personalised Career Support',
    color: '#7357F5',
    bg: 'bg-[#7357F5]/10',
    description:
      'Collaborate directly with seasoned industry strategists who understand your career trajectory. No robotic AI generators or outsourced cookie-cutter templates.',
  },
  {
    icon: Sparkles,
    title: 'Professional Presentation',
    color: '#9B6BFF',
    bg: 'bg-[#9B6BFF]/10',
    description:
      'Executive-grade resumes, high-converting LinkedIn profiles, and personal portfolio websites designed to pass enterprise ATS scanners and impress hiring leaders.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear Scope and Deliverables',
    color: '#48C7E8',
    bg: 'bg-[#48C7E8]/10',
    description:
      'Transparent milestone tracking, guaranteed 14-day unlimited revision window, and secure cloud document access through your dedicated Client Portal.',
  },
];

export function CareerWhyUsSection() {
  return (
    <section id="why-us" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7357F5] bg-[#7357F5]/10 px-3 py-1 rounded-full">
            <span>The Hopepitome Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17152F] tracking-tight">
            Why Hopepitome?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            We combine rigorous recruitment industry knowledge with high-end digital design to elevate your executive presence.
          </p>
        </div>

        {/* 3 Compact Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 sm:p-7 rounded-3xl bg-[#FAF8FF] border border-[#7357F5]/15 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#17152F] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {item.description}
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
