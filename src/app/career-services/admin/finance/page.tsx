'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllInvoices,
  saveInvoice,
  subscribeAllOrders,
  logActivity,
} from '@/lib/firebase/firestore';
import type { CareerInvoice, ServiceOrder, InvoiceLineItem } from '@/lib/career/types';
import {
  Receipt,
  Plus,
  DollarSign,
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  CreditCard,
  TrendingUp,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function AdminFinancePage() {
  const { adminProfile, role } = useAdminAuth();
  const [invoices, setInvoices] = useState<CareerInvoice[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice Form
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Professional Resume Writing & ATS Alignment', quantity: 1, unitPrice: 540, total: 540 },
  ]);
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Payment Recording Modal
  const [recordingInvoice, setRecordingInvoice] = useState<CareerInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer');
  const [txnRef, setTxnRef] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    const unsubInvoices = subscribeAllInvoices((list) => {
      setInvoices(list);
      setLoading(false);
    });

    const unsubOrders = subscribeAllOrders((list) => {
      setOrders(list);
      if (list.length > 0 && !selectedOrderId) {
        setSelectedOrderId(list[0].id);
      }
    });

    return () => {
      unsubInvoices();
      unsubOrders();
    };
  }, [selectedOrderId]);

  const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  const total = subtotal;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    setSaving(true);
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV-${yearMonth}-${randCode}`;
    const selectedOrder = orders.find((o) => o.id === selectedOrderId);

    const newInv: CareerInvoice = {
      id: invoiceNumber,
      invoiceNumber,
      clientId: selectedOrder?.clientId || 'client',
      clientName: selectedOrder?.clientName || 'Client',
      clientEmail: selectedOrder?.clientEmail || '',
      orderId: selectedOrderId,
      items: lineItems,
      subtotal,
      tax: 0,
      total,
      status: 'ISSUED',
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    try {
      await saveInvoice(newInv);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'INVOICE_ISSUED',
        entityType: 'INVOICE',
        entityId: invoiceNumber,
        summary: `Issued invoice ${invoiceNumber} for $${total} to ${selectedOrder?.clientName}`,
      });

      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating invoice:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingInvoice) return;
    setSavingPayment(true);

    const updated: CareerInvoice = {
      ...recordingInvoice,
      status: 'PAID',
      paidAt: new Date().toISOString(),
      paymentMethod,
      transactionReference: txnRef.trim(),
    };

    try {
      await saveInvoice(updated);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Finance Lead',
        actorRole: role,
        action: 'PAYMENT_RECORDED',
        entityType: 'INVOICE',
        entityId: recordingInvoice.id,
        summary: `Payment of $${recordingInvoice.total} recorded via ${paymentMethod} (${txnRef})`,
      });

      setRecordingInvoice(null);
      setTxnRef('');
    } catch (err) {
      console.error('Error recording payment:', err);
    } finally {
      setSavingPayment(false);
    }
  };

  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'ISSUED')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                FINANCIAL LEDGER
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="text-secondary font-label-sm text-xs uppercase tracking-wider font-medium">
                Billing Reconciliation & Cash Flow
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Invoices & Financial Accounting Ledger
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Issue verified service invoices, reconcile direct bank transfers, monitor accounts receivable, and maintain strict commercial audit compliance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start xl:self-center flex-wrap">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Service Invoice</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Total Invoiced Volume</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                ${(totalPaid + totalOutstanding).toLocaleString()}
              </span>
              <span className="text-xs text-secondary font-mono">USD</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{invoices.length} Registered Invoices</span>
              <span className="text-primary font-semibold">Reconciled</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Collected Cash Flow</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-emerald-800 tabular-nums">
                ${totalPaid.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-label-sm text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Settled
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Collection Integrity</span>
              <span className="text-emerald-700 font-semibold">Verified</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Outstanding Receivables</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-amber-700 tabular-nums">
                ${totalOutstanding.toLocaleString()}
              </span>
              <span className="text-xs text-secondary font-mono">Pending</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Due within 7 Days</span>
              <span className="text-amber-800 font-semibold">Active</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Settlement Velocity</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {invoices.length > 0 ? Math.round((totalPaid / (totalPaid + totalOutstanding || 1)) * 100) : 100}%
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-label-sm text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> High
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Bad Debt Ratio</span>
              <span className="text-emerald-700 font-semibold">0.0%</span>
            </div>
          </div>
        </div>

        {/* Invoices List / Table */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/30 gap-2">
            <div>
              <h2 className="font-headline-sm text-base font-bold text-primary">
                All Issued Billing Records ({invoices.length})
              </h2>
              <p className="font-body-sm text-xs text-secondary">
                Commercial records with transaction references, itemized line breakdowns, and payment status.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-xs text-secondary">
              No invoices generated yet. Click "Generate Service Invoice" to bill an active client order.
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/40 px-3 rounded-xl transition font-body-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                      {inv.paymentMethod && (
                        <span className="text-xs text-secondary font-mono">
                          via {inv.paymentMethod}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-primary">
                      {inv.clientName} <span className="text-secondary font-normal text-xs">({inv.clientEmail})</span>
                    </div>
                    <span className="text-xs text-secondary block">
                      Issued: {new Date(inv.createdAt).toLocaleDateString()} • Due: {inv.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-start sm:self-center">
                    <span className="text-base font-bold text-primary tabular-nums">
                      ${inv.total?.toLocaleString()} USD
                    </span>

                    {inv.status !== 'PAID' ? (
                      <button
                        onClick={() => setRecordingInvoice(inv)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition shadow-xs inline-flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Generate New Invoice */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <h3 className="font-headline-sm text-base font-bold text-primary">
                  Generate Service Invoice
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-surface-container-low text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Select Active Client Work Order *
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} — {o.clientName} ({o.serviceType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    required
                    value={lineItems[0]?.description || ''}
                    onChange={(e) =>
                      setLineItems([
                        {
                          ...lineItems[0],
                          description: e.target.value,
                        },
                      ])
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Amount (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      value={lineItems[0]?.unitPrice || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLineItems([
                          {
                            ...lineItems[0],
                            unitPrice: val,
                            total: val,
                          },
                        ]);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Payment Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl flex justify-between items-center text-xs">
                  <span className="font-semibold text-secondary">Total Payable:</span>
                  <span className="font-bold text-primary text-sm tabular-nums">${total} USD</span>
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Issue Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record Payment */}
        {recordingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 border border-outline-variant/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <h3 className="font-headline-sm text-base font-bold text-primary">Record Offline Payment</h3>
                <button onClick={() => setRecordingInvoice(null)} className="p-1 rounded-lg hover:bg-surface-container-low text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-secondary">
                    <span>Invoice Ref:</span>
                    <span className="font-bold text-primary font-mono">{recordingInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Amount Received:</span>
                    <span className="font-bold text-emerald-800 tabular-nums">${recordingInvoice.total} USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="Direct Bank Transfer">Direct Bank Transfer (NEFT/RTGS/Wire)</option>
                    <option value="UPI / GPay">UPI / Instant QR</option>
                    <option value="Stripe / Card">Corporate Credit Card</option>
                    <option value="PayPal">PayPal Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Bank Reference / UTR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    placeholder="e.g. UTR1938472910"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRecordingInvoice(null)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPayment}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    {savingPayment ? 'Saving...' : 'Confirm Payment'}
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
