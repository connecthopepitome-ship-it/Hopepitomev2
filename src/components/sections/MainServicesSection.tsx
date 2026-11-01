'use client';

import React from 'react';
import { Globe, Code2, Zap, Users, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    id: 'websites-stores',
    title: 'Websites & Online Stores',
    tagline: 'Get your business online.',
    description: 'High-speed business websites, product catalogs and seamless e-commerce stores designed to turn visitors into paying customers.',
    icon: Globe,
    color: '#7357F5', // Electric violet
    bgLight: 'bg-[#7357F5]/10',
    borderColor: 'border-[#7357F5]/25',
    pillText: 'Web & E-Commerce',
  },
  {
    id: 'custom-software',
    title: 'Custom Business Software',
    tagline: 'Software built around your work.',
    description: 'Tailored client portals, quotation calculators, and web applications built specifically around your day-to-day workflow.',
    icon: Code2,
    color: '#48C7E8', // Bright cyan
    bgLight: 'bg-[#48C7E8]/10',
    borderColor: 'border-[#48C7E8]/25',
    pillText: 'Custom Web Apps',
  },
  {
    id: 'business-automation',
    title: 'Business Automation',
    tagline: 'Spend less time on manual tasks.',
    description: 'Connect your favorite tools, automate repetitive spreadsheet entries, and streamline data handoffs without writing code.',
    icon: Zap,
    color: '#FF7187', // Coral
    bgLight: 'bg-[#FF7187]/10',
    borderColor: 'border-[#FF7187]/25',
    pillText: 'Automated Workflows',
  },
  {
    id: 'erp-crm',
    title: 'ERP & CRM Solutions',
    tagline: 'Manage customers and operations in one place.',
    description: 'Centralized platforms for client management, order processing, team scheduling, and financial invoicing.',
    icon: Users,
    color: '#65DDB5', // Mint
    bgLight: 'bg-[#65DDB5]/10',
    borderColor: 'border-[#65DDB5]/25',
    pillText: 'Operations Hub',
  },
];

export function MainServicesSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="what-we-build" className="py-16 sm:py-24 bg-[#0A0C14]/90 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-[#9D85FF]">
              <span>Core Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Build
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              We design and engineer practical digital tools that give your business a clear competitive edge.
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollTo('#discuss-project')}
            className="text-xs font-bold text-[#9D85FF] hover:text-white flex items-center gap-1.5 transition self-start md:self-end"
          >
            <span>Have a custom requirement? Let&apos;s talk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Compact Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative bg-[#121520]/80 hover:bg-[#171B2B] border border-white/10 hover:border-[#9D85FF]/40 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between backdrop-blur-md shadow-lg"
              >
                <div>
                  {/* Top: Icon + Pill */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${srv.color}18`, color: srv.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {srv.pillText}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#E8E2FF] transition-colors">
                    {srv.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#9D85FF] mb-3">
                    &ldquo;{srv.tagline}&rdquo;
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                    {srv.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <button
                  type="button"
                  onClick={() => scrollTo('#discuss-project')}
                  className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors"
                >
                  <span>Start this solution</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9D85FF] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default MainServicesSection;
