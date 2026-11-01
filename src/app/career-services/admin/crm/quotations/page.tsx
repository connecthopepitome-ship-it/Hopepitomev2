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
  const [itemDesc, setItemDesc] = useState('Full responsive business website with CMS and speed optimization');
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
        title: 'Project Kickoff & Requirements (40%)',
        percentage: 40,
        amount: Math.round(totalAmount * 0.4),
        condition: 'Upon quotation acceptance and contract signing',
        status: 'PENDING',
      },
      {
        id: `pm_2`,
        title: 'Development Preview & Milestone Review (40%)',
        percentage: 40,
        amount: Math.round(totalAmount * 0.4),
        condition: 'Upon staging environment review and approval',
        status: 'PENDING',
      },
      {
        id: `pm_3`,
        title: 'Final Deployment, UAT & Handover (20%)',
        percentage: 20,
        amount: Math.round(totalAmount * 0.2),
        condition: 'Upon production go-live and credential handover',
        status: 'PENDING',
      },
    ];

    const validUntilDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newQuote: QuotationRecord = {
      id: quoteId,
      quotationNumber: quoteId,
      customerId: selectedCustomerId,
      customerName: selectedClient?.name || 'Customer',
      customerEmail: selectedClient?.email || 'client@example.com',
      division,
      lineItems,
      subtotal,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      currency: 'USD',
      paymentMilestones: milestones,
      termsAndConditions: [
        'Quotation valid for 30 calendar days from issue date.',
        'Payment milestones payable within 7 business days of invoice.',
        'Standard 30-day warranty coverage included after final handover.',
      ],
      validityDays,
      validUntil: validUntilDate,
      status: 'SENT',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveQuotation(newQuote);
      setShowModal(false);
      setPreviewQuote(newQuote);
    } catch (err: any) {
      alert('Error saving quotation: ' + err?.message);
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

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Commercial Operations
              </span>
              <span className="text-xs text-[#777781] font-medium">Proposals & Quotations</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17243B] mt-1 tracking-tight">
              Commercial Quotations & Proposals
            </h1>
            <p className="text-xs text-[#777781] mt-0.5 max-w-2xl">
              Create formal quotations with itemized scopes, tax calculations, and milestone schedules. Convert accepted quotes directly into delivery projects with 1 tap.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#8172A8]" />
            <span>Create Quotation</span>
          </button>
        </div>

        {/* Division Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2DC] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDivisionFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                divisionFilter === 'ALL'
                  ? 'bg-[#17243B] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#17243B] border border-[#E6E2DC]'
              }`}
            >
              All Quotes ({quotations.length})
            </button>
            <button
              onClick={() => setDivisionFilter('IT_SERVICES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                divisionFilter === 'IT_SERVICES'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-indigo-700 border border-[#E6E2DC]'
              }`}
            >
              IT Services
            </button>
            <button
              onClick={() => setDivisionFilter('CAREER_SERVICES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                divisionFilter === 'CAREER_SERVICES'
                  ? 'bg-[#8172A8] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#8172A8] border border-[#E6E2DC]'
              }`}
            >
              Career Services
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777781]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotation # or client..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E6E2DC] rounded-xl text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
            />
          </div>
        </div>

        {/* Quotes List */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#777781]">Loading Quotations...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E2DC] p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-[#777781]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#17243B]">No Quotations Yet</h3>
            <p className="text-xs text-[#777781]">Create your first proposal or quotation to initiate commercial review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuotes.map((q) => {
              const isAccepted = q.status === 'ACCEPTED';
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-[#E6E2DC] p-5 shadow-[0_2px_8px_rgba(23,36,59,0.03)] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#17243B] text-white">
                        {q.quotationNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#17243B]">{q.customerName}</h3>
                      <p className="text-xs text-[#777781] mt-0.5">
                        {q.division === 'IT_SERVICES' ? 'IT Solution' : 'Career Service'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F7F5F0]/60 rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between text-[#777781]">
                        <span>Service:</span>
                        <span className="font-semibold text-[#17243B] truncate max-w-[160px]">
                          {q.lineItems[0]?.serviceName}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#777781]">
                        <span>Total Quotation:</span>
                        <span className="font-bold text-emerald-700">
                          ${q.totalAmount?.toLocaleString()} {q.currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#777781]">
                        <span>Valid Until:</span>
                        <span>{q.validUntil}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6E2DC] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewQuote(q)}
                      className="px-3 py-1.5 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#17243B] hover:bg-[#F7F5F0] transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#777781]" />
                      <span>View Quote</span>
                    </button>

                    {!isAccepted ? (
                      <button
                        onClick={() => handleAcceptAndConvert(q)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Convert</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Converted
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
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E6E2DC] max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">Draft Commercial Quotation</h3>
                  <p className="text-xs text-[#777781]">Select customer and itemized delivery scope.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-[#777781]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Select Customer *</label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      {clients.map((c) => (
                        <option key={c.clientId} value={c.clientId}>
                          {c.name} ({c.mobile})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Division</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value as BusinessDivision)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="IT_SERVICES">IT & Business Solutions</option>
                      <option value="CAREER_SERVICES">Career Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Website Development"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Scope Description</label>
                  <textarea
                    rows={2}
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Quantity</label>
                    <input
                      type="number"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Validity (Days)</label>
                    <input
                      type="number"
                      value={validityDays}
                      onChange={(e) => setValidityDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#17243B]">
                    <span>Total Quotation:</span>
                    <span>${(itemQty * itemPrice).toLocaleString()} USD</span>
                  </div>
                  <p className="text-[11px] text-[#777781]">Includes 3-phase milestone billing schedule (40% / 40% / 20%).</p>
                </div>

                <div className="pt-3 border-t border-[#E6E2DC] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-[#E6E2DC] max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#17243B] flex items-center justify-center text-white font-bold">
                    HP
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#17243B]">HOPEPITOME CAREER & IT SERVICES</h2>
                    <p className="text-[11px] text-[#777781]">Commercial Proposal & Formal Quotation</p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-[#777781]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quote Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#777781] block text-[10px] uppercase font-bold">Issued To</span>
                  <p className="font-bold text-[#17243B] text-sm mt-0.5">{previewQuote.customerName}</p>
                  <p className="text-[#777781]">{previewQuote.customerEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[#777781] block text-[10px] uppercase font-bold">Quotation Reference</span>
                  <p className="font-mono font-bold text-[#17243B] text-sm mt-0.5">{previewQuote.quotationNumber}</p>
                  <p className="text-[#777781]">Date: {previewQuote.createdAt.split('T')[0]}</p>
                  <p className="text-[#777781]">Valid Until: {previewQuote.validUntil}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-[#E6E2DC] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F5F0] text-[#17243B] font-bold border-b border-[#E6E2DC]">
                    <tr>
                      <th className="p-3">Service / Scope</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DC]">
                    {previewQuote.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <p className="font-bold text-[#17243B]">{item.serviceName}</p>
                          <p className="text-[11px] text-[#777781] mt-0.5">{item.description}</p>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">${item.unitPrice}</td>
                        <td className="p-3 text-right font-bold">${item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Milestones Schedule */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#17243B] uppercase tracking-wider">Payment Milestone Schedule</h4>
                <div className="space-y-1.5">
                  {previewQuote.paymentMilestones.map((pm) => (
                    <div
                      key={pm.id}
                      className="p-2.5 rounded-xl bg-[#F7F5F0]/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#17243B]">{pm.title}</p>
                        <p className="text-[10px] text-[#777781]">{pm.condition}</p>
                      </div>
                      <span className="font-bold text-emerald-700">${pm.amount} {previewQuote.currency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E6E2DC]">
                <div className="text-xs text-[#777781]">
                  Status: <span className="font-bold text-[#17243B]">{previewQuote.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#777781] block">Total Amount</span>
                  <span className="text-xl font-bold text-emerald-700">
                    ${previewQuote.totalAmount?.toLocaleString()} {previewQuote.currency}
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
