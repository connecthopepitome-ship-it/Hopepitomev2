'use client';

import React from 'react';
import { ExternalLink, Layout, ShoppingCart, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PORTFOLIO_ITEMS = [
  {
    id: 'business-studio',
    title: 'Modern Business Technology Studio',
    category: 'Website & Digital Presence',
    badge: 'Live Deployment',
    badgeColor: 'bg-emerald-500/15 text-[#65DDB5] border-emerald-500/30',
    description: 'High-performance corporate studio featuring interactive 3D WebGL background, dark/light contrast geometry, and sub-second edge deployment.',
    icon: Layout,
    accentColor: '#7357F5',
    tags: ['Next.js 14', 'Three.js / WebGL', 'Edge Deployed', 'Mobile-First'],
    link: '/',
  },
  {
    id: 'ecommerce-store',
    title: 'Modern Commerce & Product Showcase',
    category: 'E-Commerce & Digital Sales',
    badge: 'Interactive Demonstration',
    badgeColor: 'bg-blue-500/15 text-[#48C7E8] border-blue-500/30',
    description: 'Clean retail storefront with dynamic category filtering, fast cart drawer, tax/shipping calculator, and frictionless customer checkout flow.',
    icon: ShoppingCart,
    accentColor: '#48C7E8',
    tags: ['Fast Catalog', 'Cart Drawer', 'Order Sync', 'Stripe Ready'],
    link: '#discuss-project',
  },
  {
    id: 'crm-operations',
    title: 'Hopepitome CRM & Work Order Hub',
    category: 'CRM & Operations System',
    badge: 'Production Application',
    badgeColor: 'bg-purple-500/15 text-[#9B6BFF] border-purple-500/30',
    description: '12-stage sales pipeline, 1-click lead conversion to active client dossiers, automated employee work order routing, and audit logging.',
    icon: BarChart3,
    accentColor: '#9B6BFF',
    tags: ['Lead Pipeline', '1-Click Conversion', 'Auto Work Orders', 'RBAC Security'],
    link: '/career-services/admin/login',
  },
  {
    id: 'client-portal',
    title: 'Client Portal & Document Vault',
    category: 'Custom Business Application',
    badge: 'Secure Workspace',
    badgeColor: 'bg-rose-500/15 text-[#FF7187] border-rose-500/30',
    description: 'Passwordless client login with mobile OTP verification, real-time revision tracking, and isolated Google Drive cloud storage vault.',
    icon: ShieldCheck,
    accentColor: '#FF7187',
    tags: ['Passwordless Auth', 'Google Drive Sync', 'Realtime Status', 'Encrypted Vault'],
    link: '/career-services/portal/login',
  },
];

export function PortfolioSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-[#07080C] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-[#48C7E8]">
              <span>Real Work Examples</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              See What We Build
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Explore genuine applications, e-commerce storefronts, and operational portals engineered by Hopepitome.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 self-start md:self-end">
            [ Verified Systems · Clean Code · Cloud Native ]
          </div>
        </div>

        {/* 2x2 Portfolio Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PORTFOLIO_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-[#121520]/80 hover:bg-[#171B2B] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md overflow-hidden"
              >
                {/* Decorative Ambient Corner Glow */}
                <div
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: item.accentColor }}
                />

                <div>
                  {/* Top Header: Badge + Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">
                      {item.category}
                    </span>
                  </div>

                  {/* Device / Window Shell Mockup */}
                  <div className="w-full bg-[#090B12] rounded-2xl border border-white/10 p-4 mb-6 shadow-inner space-y-3">
                    {/* Browser Dots */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                        hopepitome.com/{item.id}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    {/* Mockup Content Teaser */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{item.title}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="w-3/4 h-2 rounded-full bg-white/10" />
                      <div className="w-1/2 h-2 rounded-full bg-white/10" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E8E2FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-5">
                    {item.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {item.link.startsWith('#') ? (
                    <button
                      type="button"
                      onClick={() => scrollTo(item.link)}
                      className="text-xs font-bold text-[#9D85FF] hover:text-white flex items-center gap-1.5 transition"
                    >
                      <span>Inquire about this architecture</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      href={item.link}
                      className="text-xs font-bold text-[#9D85FF] hover:text-white flex items-center gap-1.5 transition"
                    >
                      <span>View live environment</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default PortfolioSection;

