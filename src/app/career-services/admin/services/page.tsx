'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeServiceCatalogue,
  saveServiceItem,
} from '@/lib/firebase/firestore';
import { DEFAULT_SERVICE_CATALOGUE } from '@/lib/career/catalogue';
import type {
  ServiceItem,
  BusinessDivision,
  ServiceCategoryCode,
  PricingModel,
  ServicePackage,
} from '@/lib/career/types';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Edit,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  FileText,
  Tag,
  Building,
  Check,
  TrendingUp,
  History,
  Send,
  Sliders,
  CheckSquare,
  BookOpen,
} from 'lucide-react';

export default function ServiceCataloguePage() {
  const { isAuthorized, hasPermission } = useAdminAuth();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<'ALL' | BusinessDivision>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Drawer & Modal State
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDivision, setFormDivision] = useState<BusinessDivision>('IT_SERVICES');
  const [formCategoryCode, setFormCategoryCode] = useState<ServiceCategoryCode>('WEBSITE_DEV');
  const [formCategoryName, setFormCategoryName] = useState('Web & Digital Platforms');
  const [formDescription, setFormDescription] = useState('');
  const [formPricingModel, setFormPricingModel] = useState<PricingModel>('MILESTONE_BASED');
  const [formBasePrice, setFormBasePrice] = useState(45000);
  const [formDurationDays, setFormDurationDays] = useState(28);
  const [formScope, setFormScope] = useState('');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formMilestones, setFormMilestones] = useState('');

  // 1. Subscribe to Firestore or fallback to default catalogue
  useEffect(() => {
    const unsub = subscribeServiceCatalogue((data) => {
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(DEFAULT_SERVICE_CATALOGUE);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSeedDefaults = async () => {
    if (!confirm('Sync default multi-division service catalogue into Firestore?')) return;
    setLoading(true);
    try {
      for (const item of DEFAULT_SERVICE_CATALOGUE) {
        await saveServiceItem(item);
      }
      alert('Default service catalogue synced successfully!');
    } catch (err: any) {
      alert('Failed to sync catalogue: ' + (err?.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDrawer = () => {
    setEditingService(null);
    setFormName('');
    setFormCode('');
    setFormDivision('IT_SERVICES');
    setFormCategoryCode('WEBSITE_DEV');
    setFormCategoryName('Web & Digital Platforms');
    setFormDescription('');
    setFormPricingModel('MILESTONE_BASED');
    setFormBasePrice(45000);
    setFormDurationDays(28);
    setFormScope('');
    setFormDeliverables('');
    setFormMilestones('');
    setShowDrawer(true);
  };

  const handleOpenEditDrawer = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormName(srv.name);
    setFormCode(srv.code);
    setFormDivision(srv.division);
    setFormCategoryCode(srv.categoryCode);
    setFormCategoryName(srv.categoryName);
    setFormDescription(srv.description);
    setFormPricingModel(srv.pricingModel);
    setFormBasePrice(srv.defaultPackages?.[0]?.price || 45000);
    setFormDurationDays(srv.defaultDurationDays);
    setFormScope((srv.scopeOfWork || []).join('\n'));
    setFormDeliverables((srv.deliverables || []).join('\n'));
    setFormMilestones((srv.defaultMilestones || []).join('\n'));
    setShowDrawer(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      alert('Please fill out service package title and unique SKU code.');
      return;
    }

    setSaving(true);
    try {
      const id = editingService?.id || `srv_${formDivision === 'IT_SERVICES' ? 'it' : 'car'}_${Date.now()}`;
      const updated: ServiceItem = {
        id,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        division: formDivision,
        categoryCode: formCategoryCode,
        categoryName: formCategoryName,
        description: formDescription.trim(),
        defaultDurationDays: Number(formDurationDays) || 14,
        pricingModel: formPricingModel,
        scopeOfWork: formScope.split('\n').map((s) => s.trim()).filter(Boolean),
        deliverables: formDeliverables.split('\n').map((d) => d.trim()).filter(Boolean),
        defaultMilestones: formMilestones.split('\n').map((m) => m.trim()).filter(Boolean),
        defaultPackages: editingService?.defaultPackages || [
          {
            id: `pkg_${id}_std`,
            serviceId: id,
            name: 'Standard Enterprise Package',
            tier: 'BUSINESS',
            price: Number(formBasePrice) || 45000,
            currency: 'INR',
            durationDays: Number(formDurationDays) || 28,
            features: ['Standard SLA Commitment', 'Deliverable Blueprint'],
            deliverables: ['Production Sign-off'],
          },
        ],
        isActive: editingService ? editingService.isActive : true,
        sortOrder: editingService ? editingService.sortOrder : services.length + 1,
      };

      await saveServiceItem(updated);
      setShowDrawer(false);
    } catch (err: any) {
      alert('Error saving service: ' + (err?.message || 'Permission denied'));
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesDivision = selectedDivision === 'ALL' || srv.division === selectedDivision;
    const matchesCategory = activeCategory === 'ALL' || srv.categoryCode === activeCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5 font-['Manrope',sans-serif]">
        {/* Breadcrumb & Top Bar */}
        <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
              <span className="hover:text-slate-800 cursor-pointer">Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hover:text-slate-800 cursor-pointer">Delivery & Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#173B8F] font-bold">Service Catalogue Engine</span>
            </div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] text-slate-900 font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Service Catalogue & Solutions Matrix
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#173B8F] text-[11px] font-bold tracking-wide uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                Engine Spec v4.19
              </span>
            </div>
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-3xl">
              Standardized operational service offerings, pricing tiers, SLA bundles, deliverable playbooks, and service provisioning templates.
            </p>
          </div>

          {/* Header CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap self-start xl:self-auto">
            <button
              onClick={handleSeedDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-semibold border border-slate-200 transition shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Sync Defaults</span>
            </button>

            <button
              onClick={() => alert('Catalogue blueprints published to client quoting engine.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[13px] font-semibold transition"
            >
              <Send className="w-4 h-4 text-slate-600" />
              <span>Publish Updates</span>
            </button>

            <button
              onClick={handleOpenCreateDrawer}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service Package</span>
            </button>
          </div>
        </div>

        {/* 4 Live Operational Metric Ribbons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Catalogued Bundles
              </span>
              <Layers className="w-4 h-4 text-[#173B8F]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {services.length || 34}
              </span>
              <span className="text-[12px] text-slate-500">Active SKU Units</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 text-[12px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4 added this quarter</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Average Gross Margin
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                42.8%
              </span>
              <span className="text-[12px] text-slate-500">across catalog</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 text-[12px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Above 38% corporate target</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Enterprise Run-Rate
              </span>
              <DollarSign className="w-4 h-4 text-[#173B8F]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-[#173B8F] tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                ₹1.48 Cr
              </span>
              <span className="text-[12px] text-slate-500">Committed ARR</span>
            </div>
            <div className="flex items-center gap-1 text-[#173B8F] text-[12px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>47 live SLA contracts</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                SLA Assurance Index
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                99.96%
              </span>
              <span className="text-[12px] text-slate-500">Compliance</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-[12px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero critical breach incidents</span>
            </div>
          </div>
        </div>

        {/* Category Filter Controls & Utility Toolbar */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => {
                setSelectedDivision('ALL');
                setActiveCategory('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition ${
                selectedDivision === 'ALL' && activeCategory === 'ALL'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              All Services ({services.length})
            </button>
            <button
              onClick={() => {
                setSelectedDivision('IT_SERVICES');
                setActiveCategory('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition ${
                selectedDivision === 'IT_SERVICES' && activeCategory === 'ALL'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Cloud & DevOps Solutions
            </button>
            <button
              onClick={() => {
                setSelectedDivision('CAREER_SERVICES');
                setActiveCategory('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold whitespace-nowrap transition ${
                selectedDivision === 'CAREER_SERVICES' && activeCategory === 'ALL'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Career & Talent Transformation
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter packages, deliverables..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[13px] focus:outline-none focus:bg-white focus:border-[#173B8F]"
              />
            </div>
          </div>
        </div>

        {/* Split Grid: Catalog (8 Cols) & Insights (4 Cols) */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-5 items-start">
          {/* Catalog Grid: 8 Columns */}
          <div className="2xl:col-span-8 flex flex-col gap-4">
            {filteredServices.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold">No service packages found matching criteria.</p>
              </div>
            ) : (
              filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#173B8F] text-[11px] font-bold uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                          Division: {srv.division === 'IT_SERVICES' ? 'IT Services' : 'Career Services'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                          Standard SLA Tier: 99.9%
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active SKU
                        </span>
                      </div>

                      <h2 className="text-[17px] sm:text-[19px] font-bold text-slate-900 group-hover:text-[#173B8F] transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                        {srv.name}
                      </h2>
                      <p className="text-[13px] text-slate-600 leading-relaxed max-w-2xl">
                        {srv.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-start lg:items-end min-w-[170px] shrink-0 font-['Plus_Jakarta_Sans',sans-serif]">
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        Standard Pricing
                      </span>
                      <span className="text-[18px] sm:text-[20px] font-bold text-[#173B8F] tabular-nums">
                        From ${srv.defaultPackages?.[0]?.price?.toLocaleString() || '15,000'}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 font-['Manrope',sans-serif]">
                        {srv.pricingModel === 'MILESTONE_BASED' ? 'Fixed Milestone Package' : 'Subscription / Retainer'}
                      </span>
                    </div>
                  </div>

                  {/* Mid Metadata Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[12px]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-500 uppercase text-[10px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">Delivery Frame</p>
                        <p className="font-bold text-slate-800">{srv.defaultDurationDays} Days Frame</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-500 uppercase text-[10px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">Artifact Blueprint</p>
                        <p className="font-bold text-slate-800 font-mono text-[11px]">{srv.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-slate-500 uppercase text-[10px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">Operational Audit</p>
                        <p className="font-bold text-emerald-700">SOC2 & ISO Ready</p>
                      </div>
                    </div>
                  </div>

                  {/* Included Deliverables Pill Cluster */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                      Included Core Deliverables
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(srv.deliverables || ['Technical Architecture Blueprint', 'Continuous SLA Guarantee', 'Deployment Runbook']).map((del, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{del}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <span className="text-[12px] text-slate-500">
                      Template Ref: <strong className="font-mono text-slate-800">{srv.code}-v2.4</strong>
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleOpenEditDrawer(srv)}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-bold transition"
                      >
                        Configure Template
                      </button>
                      <button
                        onClick={() => alert(`Creating work order for ${srv.name}...`)}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-[#173B8F] hover:bg-[#132c6b] text-white text-[12px] font-bold transition shadow-sm"
                      >
                        Create Work Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Insights Column: 4 Columns */}
          <div className="2xl:col-span-4 flex flex-col gap-4">
            {/* Top Velocity Bundle Highlight Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#173B8F] text-white shadow-md relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-blue-200 text-[11px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                  Top Velocity Bundle
                </span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  Enterprise Cloud Infrastructure
                </h3>
                <p className="text-[12px] text-blue-100 leading-relaxed mt-1">
                  Constitutes 41% of total enterprise proposals with an 88% quote-to-close conversion rate.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-blue-200">
                  <span>Delivery Velocity Index</span>
                  <span className="font-bold">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#6ffbbe] h-full rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-200 block">Current Backlog</span>
                  <span className="text-[15px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">14 Engagements</span>
                </div>
                <button
                  onClick={() => alert('Capacity allocation verified: optimal load.')}
                  className="px-3 py-1.5 rounded bg-white text-[#173B8F] text-[11px] font-bold hover:bg-slate-100 transition"
                >
                  Inspect Capacity
                </button>
              </div>
            </div>

            {/* SLA Compliance Validator */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#173B8F]" />
                  <h3 className="text-[15px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    SLA Compliance Validator
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  ALL PASS
                </span>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Continuous verification against operational staffing bandwidth, on-call schedules, and infrastructure dependencies.
              </p>

              <div className="space-y-1.5 text-[12px]">
                <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Tier 1 Incidents (15m SLA)</span>
                  <span className="text-emerald-700 font-bold">100% Covered</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">IAC Peer Verification Cycle</span>
                  <span className="text-emerald-700 font-bold">3 SREs Active</span>
                </div>
              </div>
            </div>

            {/* Modular Add-on Engine */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#173B8F]" />
                  <h3 className="text-[15px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Modular Add-on Engine
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">SKU Stack</span>
              </div>

              <div className="space-y-2">
                <label className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#173B8F] focus:ring-[#173B8F]" />
                    <div className="text-[12px]">
                      <div className="font-bold text-slate-800">SOC2 Readiness Dossier</div>
                      <div className="text-[10px] text-slate-500">+1 Week Deliverable</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">+₹85,000</span>
                </label>

                <label className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#173B8F] focus:ring-[#173B8F]" />
                    <div className="text-[12px]">
                      <div className="font-bold text-slate-800">Multi-Region Hot Standby</div>
                      <div className="text-[10px] text-slate-500">Zero-RPO Architecture</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">+₹1,40,000</span>
                </label>
              </div>

              <button
                onClick={() => alert('Add-ons attached to active commercial quotation draft.')}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-bold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Attach to Custom Quote</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configure Package Template Side Drawer */}
        {showDrawer && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 font-['Manrope',sans-serif]">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                  SERVICE DEFINITION ENGINE
                </span>
                <h3 className="text-[17px] font-bold text-[#173B8F] mt-0.5 font-['Plus_Jakarta_Sans',sans-serif]">
                  {editingService ? 'Configure Package Template' : 'Add New Service Package'}
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-5 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                  Service Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Infrastructure Architecture"
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white focus:border-[#173B8F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Operating Division
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value as BusinessDivision)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                  >
                    <option value="IT_SERVICES">IT Services & Cloud</option>
                    <option value="CAREER_SERVICES">Career Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. IAC-AWS-PROD"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Base Valuation (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Est. Delivery Frame (Days)
                  </label>
                  <input
                    type="number"
                    value={formDurationDays}
                    onChange={(e) => setFormDurationDays(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                  Scope Overview & Technical Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive technical scope, architecture highlights, and framework coverage..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formDeliverables}
                  onChange={(e) => setFormDeliverables(e.target.value)}
                  placeholder="Terraform IAC Repository&#10;Multi-Region VPC Architecture&#10;Disaster Recovery Failover Runbook"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
