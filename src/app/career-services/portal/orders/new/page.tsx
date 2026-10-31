'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { createServiceOrder, logActivity } from '@/lib/firebase/firestore';
import type { CareerServiceType } from '@/lib/career/types';
import {
  FileText,
  Search,
  Linkedin,
  Globe,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function NewServiceOrderPage() {
  const router = useRouter();
  const { client, user } = useCareerAuth();

  const [serviceType, setServiceType] = useState<CareerServiceType>('RESUME_WRITING');
  const [packageTier, setPackageTier] = useState<'ESSENTIAL' | 'PROFESSIONAL' | 'EXECUTIVE' | 'CUSTOM'>('PROFESSIONAL');
  const [targetCompletionDate, setTargetCompletionDate] = useState('');
  const [requirements, setRequirements] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<string | null>(null);

  const services = [
    {
      id: 'RESUME_WRITING' as CareerServiceType,
      name: 'Professional Resume Writing',
      icon: FileText,
      description: 'Comprehensive resume restructuring, executive narrative crafting, and metric-backed impact statements.',
      revisionAllowance: 2,
    },
    {
      id: 'ATS_OPTIMISATION' as CareerServiceType,
      name: 'ATS Resume Optimisation',
      icon: Search,
      description: 'Algorithmic compatibility, keyword density mapping, and parser formatting for enterprise hiring systems.',
      revisionAllowance: 2,
    },
    {
      id: 'LINKEDIN_MAKEOVER' as CareerServiceType,
      name: 'LinkedIn Profile Makeover',
      icon: Linkedin,
      description: 'Compelling headline, executive about section, career highlights, and search visibility enhancement.',
      revisionAllowance: 2,
    },
    {
      id: 'PORTFOLIO_WEBSITE' as CareerServiceType,
      name: 'Personal Portfolio Websites',
      icon: Globe,
      description: 'Bespoke personal websites showcasing your projects, leadership biography, and technical achievements.',
      revisionAllowance: 3,
    },
    {
      id: 'MANAGED_JOB_SEARCH' as CareerServiceType,
      name: 'Managed Job Search & Applications',
      icon: Send,
      description: 'Curated vacancy discovery, application tracking, custom cover letters, and proactive outreach operations.',
      revisionAllowance: 2,
    },
  ];

  const packages = [
    {
      tier: 'ESSENTIAL' as const,
      name: 'Essential Kickstart',
      price: '$280',
      timeline: '3-4 Business Days',
      features: ['Single-document overhaul', 'ATS keyword analysis', '2 revision rounds'],
    },
    {
      tier: 'PROFESSIONAL' as const,
      name: 'Professional Pivot',
      price: '$540',
      popular: true,
      timeline: '4-5 Business Days',
      features: ['Full resume rebuild', 'Cover letter template', 'LinkedIn profile copy', '3 revision rounds'],
    },
    {
      tier: 'EXECUTIVE' as const,
      name: 'Executive Leadership',
      price: '$890',
      timeline: '5-7 Business Days',
      features: ['Executive dossier & biography', 'Board/C-suite positioning', 'LinkedIn strategy', 'Priority specialist review'],
    },
  ];

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id) return;

    setLoading(true);

    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ORD-${yearMonth}-${randCode}`;

    const selectedService = services.find((s) => s.id === serviceType);

    const newOrder = {
      orderNumber,
      clientId: client.id,
      clientName: client.fullName,
      clientEmail: client.email,
      serviceType,
      packageTier,
      status: 'NEW' as const,
      revisionAllowance: selectedService?.revisionAllowance || 2,
      revisionsUsed: 0,
      currentStage: 'Requirements Intake & Discovery',
      progressPercent: 10,
      serviceRequirements: requirements,
      targetCompletionDate: targetCompletionDate || '5 Business Days',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const orderId = await createServiceOrder(newOrder);
      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'ORDER_CREATED',
        entityType: 'ORDER',
        entityId: orderId,
        summary: `Created order ${orderNumber} for ${selectedService?.name} (${packageTier})`,
      });

      setOrderCreated(orderNumber);
      setTimeout(() => {
        router.push('/career-services/portal/orders');
      }, 2000);
    } catch (err) {
      console.error('Failed to create service order:', err);
      alert('Error creating order. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
            Order Career Services
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
            Configure Your Work Order
          </h1>
          <p className="text-xs text-[#777781] mt-1">
            Choose your service, select the package tier, and specify targeted objectives for our specialist team.
          </p>
        </div>

        {orderCreated ? (
          <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-[#17243B]">
              Order #{orderCreated} Successfully Registered!
            </h2>
            <p className="text-xs text-[#777781] max-w-md mx-auto">
              Our lead consultant has received your brief and is initiating scoping. Redirecting to your orders dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateOrder} className="space-y-6">
            {/* 1. Service Selection */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17243B]">
                  1. Select Primary Service
                </h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Pick the career capability you need delivered.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = serviceType === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setServiceType(srv.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#17243B] bg-[#17243B] text-white shadow-sm ring-1 ring-[#17243B]'
                          : 'border-[#E6E2DC] bg-[#FFFFFF] hover:border-[#8172A8] text-[#292D36]'
                      }`}
                    >
                      <div>
                        <Icon className={`w-5 h-5 mb-2.5 ${isSelected ? 'text-[#A69ACB]' : 'text-[#8172A8]'}`} />
                        <h4 className="text-xs font-bold leading-tight mb-1">
                          {srv.name}
                        </h4>
                        <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-white/80' : 'text-[#777781]'}`}>
                          {srv.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#E6E2DC]/30 flex items-center justify-between text-[10px]">
                        <span>Allowance: {srv.revisionAllowance} revisions</span>
                        {isSelected && <span className="font-semibold text-[#A69ACB]">Selected ✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Package Tier Selection */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17243B]">
                  2. Choose Package Tier
                </h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Tailored scope based on your career seniority and deliverable requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                  const isSelected = packageTier === pkg.tier;
                  return (
                    <div
                      key={pkg.tier}
                      onClick={() => setPackageTier(pkg.tier)}
                      className={`p-5 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#8172A8] bg-[#F7F5F0]/60 ring-2 ring-[#8172A8]'
                          : 'border-[#E6E2DC] bg-[#FFFFFF] hover:border-[#8172A8]/50'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8172A8] text-white">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-[#17243B]">{pkg.name}</h4>
                        <div className="text-xl font-bold text-[#17243B] mt-1 mb-0.5">
                          {pkg.price}
                        </div>
                        <span className="text-[11px] text-[#777781] block mb-3">
                          Est: {pkg.timeline}
                        </span>

                        <ul className="space-y-1.5 text-[11px] text-[#292D36]">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-[#8172A8] font-bold">✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E6E2DC] text-right">
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#8172A8]' : 'text-[#777781]'}`}>
                          {isSelected ? 'Selected Tier' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Service-Specific Requirements Form */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#17243B]">
                  3. Service Requirements & Targeted Scope
                </h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Specific questions calibrated for {services.find((s) => s.id === serviceType)?.name}.
                </p>
              </div>

              {serviceType === 'RESUME_WRITING' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Primary Target Position Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Director of Operations"
                      onChange={(e) => setRequirements({ ...requirements, targetRole: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Format & Aesthetic Preference
                    </label>
                    <select
                      onChange={(e) => setRequirements({ ...requirements, formatStyle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      <option value="Executive Classic">Executive Classic (Subtle serif headings, balanced margins)</option>
                      <option value="Modern Clean">Modern Clean (Contemporary sans-serif, high scannability)</option>
                      <option value="Technical Detailed">Technical Detailed (Dense technical skills categorization)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Key Highlights to Spotlight
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify your top achievements (e.g. Led $12M digital transformation, reduced churn by 18%)..."
                      onChange={(e) => setRequirements({ ...requirements, spotlightAchievements: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'ATS_OPTIMISATION' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Target Job Descriptions or Job Postings Text
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste the full job description or key responsibilities from the job postings you want to target..."
                      onChange={(e) => setRequirements({ ...requirements, jobDescriptionText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Target Applicant Tracking System (if known)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Workday, Greenhouse, Taleo, Lever (or leave blank if unknown)"
                      onChange={(e) => setRequirements({ ...requirements, atsSystem: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'LINKEDIN_MAKEOVER' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Current LinkedIn URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://linkedin.com/in/yourname"
                      onChange={(e) => setRequirements({ ...requirements, linkedinUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Target Audience
                    </label>
                    <select
                      onChange={(e) => setRequirements({ ...requirements, targetAudience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      <option value="Executive Recruiters">Executive Recruiters & Headhunters</option>
                      <option value="Enterprise Clients">Enterprise Clients & Consulting Leads</option>
                      <option value="Venture Capital">Founders, Investors & Advisory Boards</option>
                      <option value="Industry Peers">Industry Thought Leadership</option>
                    </select>
                  </div>
                </div>
              )}

              {serviceType === 'PORTFOLIO_WEBSITE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Domain or Name Preference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. eleanorvance.com or yourname.dev"
                      onChange={(e) => setRequirements({ ...requirements, domainPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Desired Website Sections
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. About Biography, Featured Case Studies, Speaking Engagements, Contact"
                      onChange={(e) => setRequirements({ ...requirements, desiredSections: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'MANAGED_JOB_SEARCH' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Target Countries or Metropolitan Markets
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sydney, Melbourne, Singapore, Global Remote"
                      onChange={(e) => setRequirements({ ...requirements, targetLocations: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Excluded Companies or Industries
                    </label>
                    <input
                      type="text"
                      placeholder="Companies you do not wish to apply to..."
                      onChange={(e) => setRequirements({ ...requirements, excludedCompanies: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#17243B] mb-1">
                  Desired Completion Timeline
                </label>
                <select
                  value={targetCompletionDate}
                  onChange={(e) => setTargetCompletionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                >
                  <option value="Standard (5 Business Days)">Standard Delivery (5 Business Days)</option>
                  <option value="Expedited (3 Business Days)">Expedited (3 Business Days)</option>
                  <option value="Urgent 48-Hour Rush">Urgent 48-Hour Studio Rush</option>
                  <option value="Flexible (Next 2 Weeks)">Flexible (Next 2 Weeks)</option>
                </select>
              </div>
            </div>

            {/* Submission button */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-[#777781]">
                <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
                <span>Confidential scoping agreement included</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Work Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </PortalLayout>
  );
}

