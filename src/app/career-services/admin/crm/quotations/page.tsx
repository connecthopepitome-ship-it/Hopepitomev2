'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeQuotations,
  saveQuotation,
  subscribeClients,
  saveProject,
} from '@/lib/firebase/firestore';
import type {
  QuotationRecord,
  QuotationLineItem,
  PaymentMilestone,
  BusinessDivision,
  ClientRecord,
  EnterpriseProjectRecord,
} from '@/lib/career/types';
import { formatINR } from '@/lib/currency';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
  Calendar,
  X,
  FileText,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Send,
  Download,
  Briefcase,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export default function QuotationsPage() {
  const { adminProfile } = useAdminAuth();

  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'ALL' | BusinessDivision>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<QuotationRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [division, setDivision] = useState<BusinessDivision>('IT_SERVICES');
  const [serviceName, setServiceName] = useState('Website Development');
  const [itemDesc, setItemDesc] = useState('Full responsive enterprise website with Next.js CMS and speed optimization');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(1299);
  const [taxPercent, setTaxPercent] = useState(0);
  const [validityDays, setValidityDays] = useState(30);

  useEffect(() => {
    const unsubQuotes = subscribeQuotations((data) => {
      setQuotations(data);
      setLoading(false);
    });
    const unsubClients = subscribeClients((cls) => {
      setClients(cls);
      if (cls.length > 0 && !selectedCustomerId) setSelectedCustomerId(cls[0].clientId);
    });

    return () => {
      unsubQuotes();
      unsubClients();
    };
  }, []);

  const handleOpenCreateModal = () => {
    setPreviewQuote(null);
    setSelectedCustomerId(clients[0]?.clientId || '');
    setDivision('IT_SERVICES');
    setServiceName('Website Development');
    setItemPrice(1299);
    setShowModal(true);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a customer.');
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const quoteId = `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedClient = clients.find((c) => c.clientId === selectedCustomerId);

    const subtotal = Number(itemQty) * Number(itemPrice);
    const taxAmount = (subtotal * Number(taxPercent)) / 100;
    const totalAmount = subtotal + taxAmount;

    const lineItems: QuotationLineItem[] = [
      {
        id: `li_${Date.now()}`,
        serviceName,
        description: itemDesc,
        quantity: Number(itemQty),
        unitPrice: Number(itemPrice),
        discount: 0,
        taxRate: Number(taxPercent),
        total: subtotal,
      },
    ];

    const milestones: PaymentMilestone[] = [
      {
        id: `pm_1`,
        title: 'Initial Deposit & Discovery Kick-off',
        percentage: 40,
        amount: Math.round(totalAmount * 0.4),
        condition: 'Upon project authorization & contract signing',
        status: 'PENDING',
      },
      {
        id: `pm_2`,
        title: 'Core Architecture & Prototype Review',
        percentage: 40,
        amount: Math.round(totalAmount * 0.4),
        condition: 'Upon delivery of functional sandbox demo',
        status: 'PENDING',
      },
      {
        id: `pm_3`,
        title: 'Final Acceptance & Production Handover',
        percentage: 20,
        amount: totalAmount - Math.round(totalAmount * 0.4) * 2,
        condition: 'Upon successful UAT deployment and sign-off',
        status: 'PENDING',
      },
    ];

    const newQuote: QuotationRecord = {
      id: quoteId,
      quotationNumber: quoteId,
      customerId: selectedCustomerId,
      customerName: selectedClient?.name || 'Enterprise Customer',
      customerEmail: selectedClient?.email || 'customer@company.com',
      division,
      status: 'SENT',
      validityDays,
      validUntil: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems,
      subtotal,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      currency: 'INR',
      paymentMilestones: milestones,
      termsAndConditions: [
        '50% deposit required prior to technical delivery commencement.',
        'All deliverables include 2 complimentary revision cycles within 14 days of submission.',
        'Hosting, third-party API quotas and cloud subscriptions are billed directly by respective providers.',
      ],
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveQuotation(newQuote);
      setShowModal(false);
    } catch (err: any) {
      alert('Error creating quotation: ' + err?.message);
    } finally {
      setSaving(false);
    }
  };

  // Convert Quote to Project & Customer
  const handleAcceptAndConvert = async (quote: QuotationRecord) => {
    if (!confirm(`Accept quotation ${quote.quotationNumber} and initialize a delivery project?`)) return;

    try {
      // 1. Update quotation status to ACCEPTED
      const updatedQuote: QuotationRecord = {
        ...quote,
        status: 'ACCEPTED',
        clientAcceptedAt: new Date().toISOString(),
        clientAcceptanceNotes: 'Accepted via Admin Commercial Dashboard',
        updatedAt: new Date().toISOString(),
      };
      await saveQuotation(updatedQuote);

      // 2. Automatically generate delivery project
      const projectId = `PRJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newProject: EnterpriseProjectRecord = {
        id: projectId,
        name: `${quote.customerName} - ${quote.lineItems[0]?.serviceName || 'Custom Project'}`,
        customerId: quote.customerId,
        customerName: quote.customerName,
        division: quote.division,
        serviceId: `srv_${Date.now()}`,
        serviceName: quote.lineItems[0]?.serviceName || 'Solution Delivery',
        projectManagerId: adminProfile?.uid || 'admin',
        projectManagerName: adminProfile?.displayName || 'Lead Manager',
        teamMembers: [],
        startDate: new Date().toISOString().split('T')[0],
        plannedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'HIGH',
        status: 'READY_TO_START',
        budget: Math.round(quote.totalAmount * 0.7),
        contractValue: quote.totalAmount,
        progressPercent: 10,
        currency: quote.currency,
        billingMethod: 'MILESTONE_BASED',
        milestones: quote.paymentMilestones.map((pm, idx) => ({
          id: `ms_${projectId}_${idx + 1}`,
          projectId,
          title: pm.title,
          orderIndex: idx + 1,
          status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveProject(newProject);
      alert(`Success! Quotation accepted and Project ${projectId} initialized automatically.`);
    } catch (err: any) {
      alert('Conversion failed: ' + err?.message);
    }
  };

  const filteredQuotes = quotations.filter((q) => {
    const matchesDiv = divisionFilter === 'ALL' || q.division === divisionFilter;
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const totalPipelineVal = quotations.reduce((acc, q) => acc + (q.totalAmount || 0), 0);
  const acceptedQuotes = quotations.filter((q) => q.status === 'ACCEPTED');
  const avgDealSize = quotations.length > 0 ? Math.round(totalPipelineVal / quotations.length) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                COMMERCIAL PIPELINE
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="text-secondary font-label-sm text-xs uppercase tracking-wider font-medium">
                Enterprise Proposals & Contract Governance
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Commercial Quotations & Proposals
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Generate structured client proposals with automated milestone schedules, itemized deliverables, and 1-tap conversion into enterprise delivery projects.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start xl:self-center flex-wrap">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition shadow-md inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quotation</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Total Proposals</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {quotations.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-xs font-bold">
                <FileText className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{acceptedQuotes.length} Executed</span>
              <span className="text-emerald-700 font-semibold">{quotations.length - acceptedQuotes.length} In Review</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Total Pipeline Value</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-emerald-800 tabular-nums">
                {formatINR(totalPipelineVal)}
              </span>
              <span className="text-xs text-secondary font-mono">INR</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Across All Divisions</span>
              <span className="text-primary font-semibold">100% Tracked</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Acceptance Rate</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {quotations.length > 0 ? Math.round((acceptedQuotes.length / quotations.length) * 100) : 0}%
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-label-sm text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> High
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Industry Benchmark</span>
              <span className="text-on-surface font-semibold">Top Tier</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Average Deal Size</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {formatINR(avgDealSize)}
              </span>
              <span className="text-xs text-secondary font-mono">INR</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Milestone Phasing</span>
              <span className="text-emerald-700 font-semibold">3-Stage</span>
            </div>
          </div>
        </div>

        {/* Division Selector & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setDivisionFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                divisionFilter === 'ALL'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              All Proposals ({quotations.length})
            </button>
            <button
              onClick={() => setDivisionFilter('IT_SERVICES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                divisionFilter === 'IT_SERVICES'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              IT Services
            </button>
            <button
              onClick={() => setDivisionFilter('CAREER_SERVICES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                divisionFilter === 'CAREER_SERVICES'
                  ? 'bg-primary-container text-white shadow-xs'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              Career Services
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotation # or client..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs text-on-surface placeholder-secondary focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
            />
          </div>
        </div>

        {/* Quotations Grid */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-secondary font-medium">Loading Quotation Telemetry...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-12 text-center space-y-3 shadow-xs">
            <Receipt className="w-10 h-10 text-secondary/40 mx-auto" />
            <h3 className="text-sm font-bold text-primary">No Quotations Found</h3>
            <p className="text-xs text-secondary">
              Create a formal proposal to initiate customer negotiation and milestone tracking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((q) => {
              const isAccepted = q.status === 'ACCEPTED';
              return (
                <div
                  key={q.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant/30">
                        {q.quotationNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-primary">{q.customerName}</h3>
                      <p className="text-xs text-secondary mt-0.5">
                        {q.division === 'IT_SERVICES' ? 'IT & Business Solutions' : 'Career Services Studio'}
                      </p>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 text-xs font-body-sm">
                      <div className="flex justify-between text-secondary">
                        <span>Service:</span>
                        <span className="font-semibold text-primary truncate max-w-[160px]">
                          {q.lineItems[0]?.serviceName}
                        </span>
                      </div>
                      <div className="flex justify-between text-secondary">
                        <span>Total Scope:</span>
                        <span className="font-bold text-emerald-800 tabular-nums">
                          {formatINR(q.totalAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-secondary">
                        <span>Valid Until:</span>
                        <span className="font-medium text-on-surface">{q.validUntil}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewQuote(q)}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-primary hover:bg-surface-container-low transition inline-flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-secondary" />
                      <span>View Scope</span>
                    </button>

                    {!isAccepted ? (
                      <button
                        onClick={() => handleAcceptAndConvert(q)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition inline-flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Convert</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Converted to Project
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create Quotation */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">Draft Commercial Quotation</h3>
                  <p className="font-body-sm text-xs text-secondary">Select customer and configure itemized delivery scope.</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-container-low text-secondary hover:text-on-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Select Customer *</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    >
                      {clients.map((c) => (
                        <option key={c.clientId} value={c.clientId}>
                          {c.name} ({c.mobile})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Division</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value as BusinessDivision)}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="IT_SERVICES">IT & Business Solutions</option>
                      <option value="CAREER_SERVICES">Career Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Website Development"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Scope Description</label>
                  <textarea
                    rows={2}
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Quantity</label>
                    <input
                      type="number"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Validity (Days)</label>
                    <input
                      type="number"
                      value={validityDays}
                      onChange={(e) => setValidityDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-primary">
                    <span>Total Scope Quotation:</span>
                    <span className="tabular-nums">{formatINR(itemQty * itemPrice)}</span>
                  </div>
                  <p className="text-xs text-secondary">Includes 3-phase milestone billing schedule (40% / 40% / 20%).</p>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold shadow-xs hover:bg-primary transition disabled:opacity-50"
                  >
                    {saving ? 'Generating...' : 'Issue Quotation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Quotation Print Sheet */}
        {previewQuote && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                    HP
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-primary">HOPEPITOME ENTERPRISE SOLUTIONS</h2>
                    <p className="text-xs text-secondary">Commercial Proposal & Formal Quotation</p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-1.5 rounded-lg hover:bg-surface-container-low text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quote Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs font-body-sm">
                <div>
                  <span className="text-secondary block text-xs uppercase font-bold tracking-wider">Issued To</span>
                  <p className="font-bold text-primary text-sm mt-0.5">{previewQuote.customerName}</p>
                  <p className="text-secondary">{previewQuote.customerEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-secondary block text-xs uppercase font-bold tracking-wider">Quotation Reference</span>
                  <p className="font-mono font-bold text-primary text-sm mt-0.5">{previewQuote.quotationNumber}</p>
                  <p className="text-secondary">Date: {previewQuote.createdAt.split('T')[0]}</p>
                  <p className="text-secondary">Valid Until: {previewQuote.validUntil}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-container-low text-primary font-bold border-b border-outline-variant/30">
                    <tr>
                      <th className="p-3">Service / Scope</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                    {previewQuote.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <p className="font-bold text-primary">{item.serviceName}</p>
                          <p className="text-xs text-secondary mt-0.5">{item.description}</p>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right tabular-nums">{formatINR(item.unitPrice)}</td>
                        <td className="p-3 text-right font-bold text-primary tabular-nums">{formatINR(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Milestones Schedule */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Payment Milestone Schedule</h4>
                <div className="space-y-1.5 font-body-sm">
                  {previewQuote.paymentMilestones.map((pm) => (
                    <div
                      key={pm.id}
                      className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-primary">{pm.title}</p>
                        <p className="text-xs text-secondary">{pm.condition}</p>
                      </div>
                      <span className="font-bold text-emerald-800 tabular-nums">{formatINR(pm.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <div className="text-xs text-secondary">
                  Status: <span className="font-bold text-primary">{previewQuote.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary block">Total Amount</span>
                  <span className="text-xl font-bold text-emerald-800 tabular-nums">
                    {formatINR(previewQuote.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
