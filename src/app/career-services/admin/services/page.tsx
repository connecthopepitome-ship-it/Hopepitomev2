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
} from 'lucide-react';

export default function ServiceCataloguePage() {
  const { isAuthorized, hasPermission } = useAdminAuth();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<'ALL' | BusinessDivision>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
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
  const [formDurationDays, setFormDurationDays] = useState(21);
  const [formScope, setFormScope] = useState('');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formMilestones, setFormMilestones] = useState('');

  // 1. Subscribe to Firestore or fallback to default catalogue
  useEffect(() => {
    const unsub = subscribeServiceCatalogue((data) => {
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback to default in-memory catalogue
        setServices(DEFAULT_SERVICE_CATALOGUE);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Sync default catalogue to Firestore if empty
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

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormName('');
    setFormCode('');
    setFormDivision('IT_SERVICES');
    setFormCategoryCode('WEBSITE_DEV');
    setFormCategoryName('Web & Digital Platforms');
    setFormDescription('');
    setFormPricingModel('MILESTONE_BASED');
    setFormDurationDays(21);
    setFormScope('');
    setFormDeliverables('');
    setFormMilestones('');
    setShowModal(true);
  };

  const handleOpenEditModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormName(srv.name);
    setFormCode(srv.code);
    setFormDivision(srv.division);
    setFormCategoryCode(srv.categoryCode);
    setFormCategoryName(srv.categoryName);
    setFormDescription(srv.description);
    setFormPricingModel(srv.pricingModel);
    setFormDurationDays(srv.defaultDurationDays);
    setFormScope((srv.scopeOfWork || []).join('\n'));
    setFormDeliverables((srv.deliverables || []).join('\n'));
    setFormMilestones((srv.defaultMilestones || []).join('\n'));
    setShowModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      alert('Please fill out service name and unique service code.');
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
            name: 'Standard Package',
            tier: 'BUSINESS',
            price: 999,
            currency: 'USD',
            durationDays: Number(formDurationDays) || 14,
            features: ['Standard Scope', 'Technical Delivery'],
            deliverables: ['Final Deliverable'],
          },
        ],
        isActive: editingService ? editingService.isActive : true,
        sortOrder: editingService ? editingService.sortOrder : services.length + 1,
      };

      await saveServiceItem(updated);
      setShowModal(false);
    } catch (err: any) {
      alert('Error saving service: ' + (err?.message || 'Permission denied'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (srv: ServiceItem) => {
    try {
      await saveServiceItem({ ...srv, isActive: !srv.isActive });
    } catch (err: any) {
      alert('Failed to update status: ' + err?.message);
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

  const itCount = services.filter((s) => s.division === 'IT_SERVICES').length;
  const careerCount = services.filter((s) => s.division === 'CAREER_SERVICES').length;

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Multi-Division Architecture
              </span>
              <span className="text-xs text-[#777781] font-medium">Enterprise Catalogue</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17243B] mt-1 tracking-tight">
              Service Catalogue & Configuration Engine
            </h1>
            <p className="text-xs text-[#777781] mt-0.5 max-w-2xl">
              Configure IT solutions, consulting, automation, and career services with dynamic pricing models, packages, and delivery milestones.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSeedDefaults}
              className="px-3.5 py-2 rounded-xl border border-[#E6E2DC] bg-white text-[#17243B] text-xs font-semibold hover:bg-[#F7F5F0] transition flex items-center gap-1.5 shadow-sm"
              title="Sync default services to cloud"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#777781]" />
              <span>Sync Defaults</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#8172A8]" />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Division Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2DC] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDivision('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedDivision === 'ALL'
                  ? 'bg-[#17243B] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#17243B] border border-[#E6E2DC]'
              }`}
            >
              <span>All Divisions</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedDivision('IT_SERVICES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedDivision === 'IT_SERVICES'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-indigo-700 border border-[#E6E2DC]'
              }`}
            >
              <span>IT & Business Solutions</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700">
                {itCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedDivision('CAREER_SERVICES')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                selectedDivision === 'CAREER_SERVICES'
                  ? 'bg-[#8172A8] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#8172A8] border border-[#E6E2DC]'
              }`}
            >
              <span>Career Services & Branding</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-50 text-purple-700">
                {careerCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777781]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or code..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E6E2DC] rounded-xl text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
            />
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#777781]">Loading Service Catalogue...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E2DC] p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-[#777781]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#17243B]">No Services Found</h3>
            <p className="text-xs text-[#777781]">Try searching with a different keyword or sync defaults.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((srv) => {
              const isIT = srv.division === 'IT_SERVICES';
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-[#E6E2DC] p-5 shadow-[0_2px_8px_rgba(23,36,59,0.03)] hover:border-[#8172A8]/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          isIT
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                        }`}
                      >
                        {isIT ? 'IT Solution' : 'Career Service'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#777781] font-semibold">
                          {srv.code}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            srv.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#17243B] tracking-tight hover:text-[#8172A8]">
                        {srv.name}
                      </h3>
                      <p className="text-[11px] font-medium text-[#777781] mt-0.5">
                        {srv.categoryName}
                      </p>
                    </div>

                    <p className="text-xs text-[#292D36]/80 leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6E2DC]/60 text-[11px]">
                      <div>
                        <span className="text-[#777781] block text-[10px] uppercase font-semibold">
                          Pricing Model
                        </span>
                        <span className="font-semibold text-[#17243B]">
                          {srv.pricingModel.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#777781] block text-[10px] uppercase font-semibold">
                          Default Timeline
                        </span>
                        <span className="font-semibold text-[#17243B]">
                          {srv.defaultDurationDays} Days
                        </span>
                      </div>
                    </div>

                    {/* Packages Preview */}
                    {srv.defaultPackages && srv.defaultPackages.length > 0 && (
                      <div className="pt-2 border-t border-[#E6E2DC]/60">
                        <span className="text-[10px] font-bold text-[#777781] uppercase tracking-wider block mb-1">
                          Packages ({srv.defaultPackages.length})
                        </span>
                        <div className="space-y-1">
                          {srv.defaultPackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="flex items-center justify-between text-xs px-2.5 py-1 bg-[#F7F5F0]/70 rounded-lg"
                            >
                              <span className="font-medium text-[#17243B]">{pkg.name}</span>
                              <span className="font-bold text-[#17243B]">
                                ${pkg.price}{' '}
                                <span className="text-[10px] font-normal text-[#777781]">
                                  {pkg.currency}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-4 border-t border-[#E6E2DC] flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded transition ${
                        srv.isActive
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {srv.isActive ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(srv)}
                      className="px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs font-semibold text-[#17243B] hover:bg-[#F7F5F0] transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#777781]" />
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add / Configure Service */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E6E2DC] max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">
                    {editingService ? `Configure Service: ${editingService.name}` : 'Create New Service'}
                  </h3>
                  <p className="text-xs text-[#777781]">
                    Set service division, pricing models, scope deliverables, and default milestones.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-[#777781]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Business Division *
                    </label>
                    <select
                      value={formDivision}
                      onChange={(e) => setFormDivision(e.target.value as BusinessDivision)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="IT_SERVICES">Division A: IT & Business Solutions</option>
                      <option value="CAREER_SERVICES">Division B: Career Services & Branding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Service Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="e.g. ERP_CONSULTING"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-mono font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Ecommerce Store Development"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formCategoryName}
                      onChange={(e) => setFormCategoryName(e.target.value)}
                      placeholder="e.g. Ecommerce & Retail"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Short description for commercial proposals and client portal..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Pricing Model *
                    </label>
                    <select
                      value={formPricingModel}
                      onChange={(e) => setFormPricingModel(e.target.value as PricingModel)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="MILESTONE_BASED">Milestone Based</option>
                      <option value="FIXED_PRICE">Fixed Price</option>
                      <option value="MONTHLY_RETAINER">Monthly Retainer</option>
                      <option value="ANNUAL_MAINTENANCE">Annual Maintenance (AMC)</option>
                      <option value="HOURLY">Hourly Rate</option>
                      <option value="CUSTOM_QUOTATION">Custom Quotation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Default Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={formDurationDays}
                      onChange={(e) => setFormDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Scope of Work (1 item per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formScope}
                      onChange={(e) => setFormScope(e.target.value)}
                      placeholder="UI/UX mockups&#10;Next.js frontend&#10;Payment integration"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Deliverables (1 item per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formDeliverables}
                      onChange={(e) => setFormDeliverables(e.target.value)}
                      placeholder="Production deployment&#10;Git repository&#10;User documentation"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Default Project Milestones (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formMilestones}
                    onChange={(e) => setFormMilestones(e.target.value)}
                    placeholder="Discovery & Design (30%)&#10;Development & Preview (40%)&#10;UAT & Handover (30%)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E6E2DC] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#777781] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

