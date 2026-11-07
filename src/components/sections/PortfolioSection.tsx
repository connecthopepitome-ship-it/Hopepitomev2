'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Globe,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  Layers,
  Zap,
  ShoppingBag,
  Leaf,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
}

interface CaseStudy {
  challenge: string;
  solution: string;
  security: string;
  outcome: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: 'storefront' | 'enterprise';
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  description: string;
  displayUrl: string;
  link: string;
  isExternal: boolean;
  tags: string[];
  metrics: MetricItem[];
  logo?: string;
  previewImage?: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  caseStudy: CaseStudy;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'soravya',
    title: 'Soravya — Luxury Ethnic Wear Storefront',
    client: 'Soravya Lifestyle',
    category: 'storefront',
    categoryLabel: 'E-Commerce & Headless Sheets CMS',
    badge: 'Live Edge Storefront',
    badgeColor: 'bg-amber-500/15 text-[#F5C26B] border-amber-500/30',
    accentColor: '#F5C26B',
    description:
      'Mobile-first luxury saree storefront powered by a real-time Google Sheets headless CMS. Instant catalog updates, zero-redeploy stock synchronization, and sub-second edge response.',
    displayUrl: 'soravya.connect-hopepitome.workers.dev',
    link: 'https://soravya.connect-hopepitome.workers.dev/',
    isExternal: true,
    tags: [
      'Next.js 14 App Router',
      'Cloudflare Workers',
      'Google Sheets CMS',
      'Google Apps Script API',
      'Tailwind CSS',
      'WhatsApp Order Flow',
    ],
    metrics: [
      { label: 'Edge Latency', value: '< 250ms' },
      { label: 'Catalog Sync', value: 'Real-Time' },
      { label: 'Infrastructure', value: 'Serverless Edge' },
    ],
    logo: '/projects/soravya-logo.png',
    previewImage: '/projects/soravya-preview.jpg',
    icon: ShoppingBag,
    highlights: [
      '38-column Google Spreadsheet serves as a zero-maintenance CMS for the owner',
      'Google Apps Script API layer strips wholesale costs & supplier links before delivery',
      'Instant collection filtering across silk, organza, and festive occasion lines',
      'WhatsApp direct ordering & mobile-first sticky shopping bag drawer',
    ],
    caseStudy: {
      challenge:
        'The boutique client needed a high-end e-commerce storefront to showcase and sell sarees without the complex overhead or high monthly subscription fees of Shopify or Magento. Non-technical staff already managed inventory in spreadsheets and required that price or stock changes reflect on the storefront instantly without code deployments or developer assistance.',
      solution:
        'Hopepitome engineered a headless commerce architecture using Google Sheets as the single source of truth. A specialized Google Apps Script API layer validates rows, normalizes product schemas, and strictly filters out wholesale pricing and supplier references before serving sanitized DTOs to the Next.js edge storefront running on Cloudflare Workers.',
      security:
        'Client-facing payloads strictly contain customer-approved product information, prices, and high-resolution galleries. Wholesale supplier URLs, cost baselines, and margin calculations are isolated server-side and never leak to the client browser.',
      outcome:
        'Sub-second catalog browsing on 4G/5G mobile networks worldwide, instant collection publishing directly from Google Drive, and frictionless WhatsApp and cart purchasing with zero hosting overhead.',
    },
  },
  {
    id: 'plantrix',
    title: 'Plantrix Botanics — Botanical Living & Home Essentials',
    client: 'Plantrix Botanics',
    category: 'storefront',
    categoryLabel: 'E-Commerce & Cloud Architecture',
    badge: 'Live Production Store',
    badgeColor: 'bg-emerald-500/15 text-[#65DDB5] border-emerald-500/30',
    accentColor: '#65DDB5',
    description:
      'Curated botanical lifestyle and modern home utility storefront. Engineered with Firebase Firestore, Cloudflare R2 object storage for rapid image delivery, and frictionless multi-category checkout.',
    displayUrl: 'plantrixbotanics.com',
    link: 'https://plantrixbotanics.com',
    isExternal: true,
    tags: [
      'Next.js 14 App Router',
      'Firebase Firestore',
      'Cloudflare R2 Storage',
      'Cloudflare Edge Workers',
      'Tailwind CSS',
      'Cart Drawer',
    ],
    metrics: [
      { label: 'Architecture', value: 'Firebase + R2' },
      { label: 'Taxonomy', value: 'Dual-Department' },
      { label: 'Media CDN', value: 'Cloudflare R2' },
    ],
    logo: '/projects/plantrix-logo.png',
    previewImage: '/projects/plantrix-preview.jpg',
    icon: Leaf,
    highlights: [
      'Universal product taxonomy supporting Plants & Botanics plus Home Utilities',
      'Cloudflare R2 image pipeline delivering lightning-fast, unthrottled media',
      'Real-time Firestore catalog, live inventory guards, and customer auth',
      'Supplier abstraction architecture maintaining private fulfillment operations',
    ],
    caseStudy: {
      challenge:
        'Plantrix required a distinctive, modern lifestyle storefront spanning two distinct product departments—Botanicals (pots, planters, indoor greenery) and Home Essentials (storage, organizers, kitchen utilities)—with high visual appeal and lightning-fast image loading on mobile devices.',
      solution:
        'Hopepitome architected a dual-department universal taxonomy supported by Firebase Firestore for real-time inventory and customer state, coupled with Cloudflare R2 object storage for global edge asset delivery without bandwidth egress penalties.',
      security:
        'Implemented server-side price validation, protected Firestore security rules, and a private supplier abstraction layer ensuring customer checkout is completely decoupled from fulfillment source details.',
      outcome:
        'High-conversion visual browsing with instant cart slideouts, responsive touch filtering across indoor and home collections, and reliable edge uptime.',
    },
  },
  {
    id: 'crm-operations',
    title: 'Hopepitome CRM & Operations Engine',
    client: 'Internal Enterprise Suite',
    category: 'enterprise',
    categoryLabel: 'CRM & Operations System',
    badge: 'Production Application',
    badgeColor: 'bg-purple-500/15 text-[#9B6BFF] border-purple-500/30',
    accentColor: '#9B6BFF',
    description:
      'Full-cycle operational cockpit featuring a 12-stage sales pipeline, 1-click lead conversion to active client dossiers, automated employee work order routing, and audit logging.',
    displayUrl: 'hopepitome.com/admin',
    link: '/career-services/admin/login',
    isExternal: false,
    tags: [
      'Next.js 14 App Router',
      'Sales Pipeline',
      '1-Click Conversion',
      'Auto Work Orders',
      'RBAC Security',
      'Audit Trail',
    ],
    metrics: [
      { label: 'Pipeline Stages', value: '12 Lifecycle Steps' },
      { label: 'Security Model', value: 'Granular RBAC' },
      { label: 'Event Logging', value: '100% Audit Logged' },
    ],
    icon: BarChart3,
    highlights: [
      'Comprehensive 12-stage client journey from intake inquiry to deliverable handoff',
      'Automated milestone task generation for assigned developers and consultants',
      'Role-based permission enforcement with complete audit trail history',
      'Integrated quotation calculator and automated consultation scheduling',
    ],
    caseStudy: {
      challenge:
        'Service and consulting businesses lose revenue and time when sales leads, intake questionnaires, consultant allocations, and invoicing live in disconnected spreadsheets and chat threads.',
      solution:
        'We created an all-in-one operational system that captures inbound inquiries, manages prospects through 12 rigorous pipeline stages, and automatically routes work orders with checklist tasks to team members.',
      security:
        'Multi-role access control (Admin, Manager, Specialist, Auditor) ensuring staff only view client records relevant to their authorized responsibilities.',
      outcome:
        '100% visibility into client delivery milestones, elimination of manual status follow-ups, and a dependable audit trail across all projects.',
    },
  },
  {
    id: 'client-portal',
    title: 'Client Workspace & Document Vault',
    client: 'Client Collaboration Suite',
    category: 'enterprise',
    categoryLabel: 'Client Portal & Secure Vault',
    badge: 'Secure Workspace',
    badgeColor: 'bg-rose-500/15 text-[#FF7187] border-rose-500/30',
    accentColor: '#FF7187',
    description:
      'Passwordless client collaboration portal with mobile OTP verification, real-time revision tracking, deliverable previews, and isolated Google Drive cloud storage vault.',
    displayUrl: 'hopepitome.com/portal',
    link: '/career-services/portal/login',
    isExternal: false,
    tags: [
      'Passwordless Auth',
      'Google Drive Sync',
      'Real-Time Status',
      'Encrypted Vault',
      'Revision Diffing',
      'Mobile Responsive',
    ],
    metrics: [
      { label: 'Auth Method', value: 'OTP / Magic Link' },
      { label: 'Cloud Storage', value: 'Google Drive Sync' },
      { label: 'Deliverables', value: 'Real-Time Revisions' },
    ],
    icon: ShieldCheck,
    highlights: [
      'Frictionless client authentication without password fatigue or reset tickets',
      'Encrypted cloud document vault with Google Drive synchronization',
      'Real-time deliverable inspection, feedback submission, and approval stamps',
      'Instant access to historical invoices, project timelines, and status updates',
    ],
    caseStudy: {
      challenge:
        'Email attachments and scattered cloud drive links create version chaos, missed feedback cycles, and security exposure when sharing sensitive client deliverables.',
      solution:
        'A dedicated, passwordless client portal that grants verified clients instant access to their deliverables, structured revision requests, and direct communication logs.',
      security:
        'Zero-password OTP verification tied directly to verified client phone or email, backed by isolated per-client storage permissions.',
      outcome:
        'Friction-free customer onboarding, accelerated client review turnarounds, and a professional enterprise-grade client touchpoint.',
    },
  },
];

export function PortfolioSection() {
  const [filter, setFilter] = useState<'all' | 'storefront' | 'enterprise'>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioItem | null>(null);

  const filteredItems =
    filter === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === filter);

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-[#07080C] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-[#48C7E8]">
              <Sparkles className="w-3.5 h-3.5 text-[#48C7E8]" />
              <span>Real Work &amp; Live Systems</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              See What We Build
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Explore genuine live storefronts, cloud-native architectures, and operational platforms engineered by Hopepitome.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                filter === 'all'
                  ? 'bg-white text-[#07080C] border-white font-bold shadow-lg shadow-white/10'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              All Projects ({PORTFOLIO_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('storefront')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                filter === 'storefront'
                  ? 'bg-[#F5C26B] text-[#07080C] border-[#F5C26B] font-bold shadow-lg shadow-[#F5C26B]/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              Live Storefronts (2)
            </button>
            <button
              type="button"
              onClick={() => setFilter('enterprise')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                filter === 'enterprise'
                  ? 'bg-[#9B6BFF] text-white border-[#9B6BFF] font-bold shadow-lg shadow-[#9B6BFF]/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              Custom Business Systems (2)
            </button>
          </div>
        </div>

        {/* Portfolio Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-[#121520]/80 hover:bg-[#171B2B] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md overflow-hidden"
              >
                {/* Decorative Ambient Corner Glow */}
                <div
                  className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: item.accentColor }}
                />

                <div>
                  {/* Top Header: Badge + Category */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${item.badgeColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-medium">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Device / Browser Window Shell Mockup */}
                  <div className="w-full bg-[#090B12] rounded-2xl border border-white/10 overflow-hidden mb-6 shadow-inner">
                    {/* Simulated Browser Title Bar */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-[#07080C]/90">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>

                      {/* Browser Address Bar */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 max-w-[280px] sm:max-w-[340px] truncate">
                        <Lock className="w-3 h-3 text-[#65DDB5] shrink-0" />
                        <span className="text-slate-500">https://</span>
                        <span className="text-white font-medium truncate">{item.displayUrl}</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Visual Preview / Banner Area */}
                    {item.previewImage ? (
                      <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden">
                        <Image
                          src={item.previewImage}
                          alt={item.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090B12] via-[#090B12]/40 to-transparent" />

                        {/* Brand Logo Overlay */}
                        {item.logo && (
                          <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-xl bg-[#090B12]/80 backdrop-blur-md border border-white/15 shadow-lg flex items-center">
                            <Image
                              src={item.logo}
                              alt={item.client}
                              width={120}
                              height={36}
                              className="h-5 sm:h-6 w-auto object-contain brightness-110 drop-shadow"
                            />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                          Active Edge Deployment
                        </div>
                      </div>
                    ) : (
                      /* Stylized Dashboard Mockup for Internal Enterprise Systems */
                      <div className="p-4 sm:p-5 bg-gradient-to-b from-[#0F1322] to-[#090B12] space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#9B6BFF] animate-pulse" />
                            <span>{item.client}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">RBAC Secure</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <div className="text-[9px] font-mono text-slate-400 uppercase">Status</div>
                            <div className="text-xs font-bold text-[#65DDB5]">Active</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <div className="text-[9px] font-mono text-slate-400 uppercase">Uptime</div>
                            <div className="text-xs font-bold text-white">99.98%</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <div className="text-[9px] font-mono text-slate-400 uppercase">Access</div>
                            <div className="text-xs font-bold text-[#9D85FF]">Verified</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#E8E2FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-4">
                    {item.description}
                  </p>

                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    {item.metrics.map((m) => (
                      <div key={m.label} className="text-center sm:text-left">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          {m.label}
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5 truncate">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
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

                {/* Bottom Action Links */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Case Study Details Modal Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedCaseStudy(item)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition py-1"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#48C7E8]" />
                    <span>Architecture Blueprint</span>
                  </button>

                  {/* Live Link Button */}
                  {item.isExternal ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#07080C] bg-gradient-to-r from-white to-slate-200 hover:brightness-105 transition shadow-md shadow-white/10"
                    >
                      <span>Visit Live Storefront</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={item.link}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition"
                    >
                      <span>Explore System</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Note */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#65DDB5]/10 border border-[#65DDB5]/25 text-[#65DDB5]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have a unique business workflow or product catalog?</h4>
              <p className="text-xs text-slate-300 font-sans">
                We engineer custom storefronts and business software tailored exactly to your operation.
              </p>
            </div>
          </div>
          <a
            href="#discuss-project"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] text-white text-xs font-bold shadow-lg shadow-[#7357F5]/25 hover:opacity-95 transition"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Deep-Dive Architecture Case Study Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0E111C] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#121624]">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCaseStudy.accentColor }}
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedCaseStudy.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">
                    Case Study &amp; Technical Architecture Blueprint
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaseStudy(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm font-sans text-slate-300">
              {/* Challenge */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>The Business Challenge</span>
                </div>
                <p className="leading-relaxed">{selectedCaseStudy.caseStudy.challenge}</p>
              </div>

              {/* Solution */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-[#48C7E8] font-bold text-xs uppercase tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#48C7E8]" />
                  <span>The Engineered Solution</span>
                </div>
                <p className="leading-relaxed">{selectedCaseStudy.caseStudy.solution}</p>
              </div>

              {/* Security Boundary */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 text-[#F5C26B] font-bold text-xs uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#F5C26B]" />
                  <span>Security &amp; Data Boundary</span>
                </div>
                <p className="leading-relaxed">{selectedCaseStudy.caseStudy.security}</p>
              </div>

              {/* Measurable Production Outcome */}
              <div className="space-y-2 p-4 rounded-2xl bg-[#65DDB5]/5 border border-[#65DDB5]/20">
                <div className="flex items-center gap-2 text-[#65DDB5] font-bold text-xs uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#65DDB5]" />
                  <span>Production Impact &amp; Results</span>
                </div>
                <p className="leading-relaxed text-slate-200">
                  {selectedCaseStudy.caseStudy.outcome}
                </p>
              </div>

              {/* Full Tech Stack */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Engineered With:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCaseStudy.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#121624]">
              <div className="text-xs font-mono text-slate-400 truncate max-w-[220px] sm:max-w-none">
                URL: {selectedCaseStudy.displayUrl}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Close
                </button>

                {selectedCaseStudy.isExternal ? (
                  <a
                    href={selectedCaseStudy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#07080C] bg-white hover:bg-slate-200 transition"
                  >
                    <span>Launch Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href={selectedCaseStudy.link}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7357F5] hover:bg-[#836BF5] transition"
                  >
                    <span>Open Live System</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PortfolioSection;
