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
        entityId: newInv.id,
        summary: `Issued invoice ${invoiceNumber} for $${total} to ${selectedOrder?.clientName}`,
      });

      setShowCreateModal(false);
      alert(`Invoice ${invoiceNumber} issued successfully!`);
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
      transactionReference: txnRef.trim() || 'MANUAL-PAYMENT-VERIFIED',
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
        summary: `Recorded manual payment of $${recordingInvoice.total} for ${recordingInvoice.invoiceNumber} via ${paymentMethod}`,
      });
      alert('Payment receipt confirmed.');
      setRecordingInvoice(null);
    } catch (err) {
      console.error('Error recording payment:', err);
    } finally {
      setSavingPayment(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Financial Accounting
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Quotations & Invoices Ledger
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Issue service invoices, generate official quotations, and reconcile payments.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Invoice</span>
          </button>
        </div>

        {/* Invoices List */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
            All Issued Billing Records ({invoices.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777781]">
              No invoices generated yet. Click "Generate New Invoice" to bill an active client order.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F0]/30 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#17243B]">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#17243B] mt-0.5">
                      {inv.clientName} ({inv.clientEmail})
                    </div>
                    <span className="text-[11px] text-[#777781] block">
                      Issued: {new Date(inv.createdAt).toLocaleDateString()} • Due: {inv.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#17243B]">
                      ${inv.total} USD
                    </span>

                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => setRecordingInvoice(inv)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Generate New Invoice */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Generate Service Invoice
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Select Client Service Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} — {o.clientName} ({o.serviceType.replace(/_/g, ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    required
                    value={lineItems[0].description}
                    onChange={(e) =>
                      setLineItems([
                        { ...lineItems[0], description: e.target.value },
                      ])
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={lineItems[0].unitPrice}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setLineItems([
                          { ...lineItems[0], unitPrice: price, total: price },
                        ]);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F5F0] rounded-xl flex items-center justify-between text-xs font-bold text-[#17243B]">
                  <span>Total Amount Due:</span>
                  <span>${total} USD</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition disabled:opacity-50"
                  >
                    {saving ? 'Issuing...' : 'Issue Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record Payment */}
        {recordingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Record Payment Confirmation
                </h3>
                <button
                  onClick={() => setRecordingInvoice(null)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E6E2DC] text-xs">
                <span className="font-mono text-[#8172A8] font-bold block">
                  {recordingInvoice.invoiceNumber}
                </span>
                <span className="font-bold text-[#17243B]">
                  {recordingInvoice.clientName} — ${recordingInvoice.total} USD
                </span>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="Direct Bank Wire / EFT">Direct Bank Wire / EFT</option>
                    <option value="Stripe Credit Card">Stripe Credit Card</option>
                    <option value="PayPal Corporate">PayPal Corporate</option>
                    <option value="Manual Accounting Voucher">Manual Accounting Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Transaction / Bank Reference Code
                  </label>
                  <input
                    type="text"
                    required
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    placeholder="e.g. WIRE-8392019"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setRecordingInvoice(null)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPayment}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    {savingPayment ? 'Confirming...' : 'Confirm Receipt'}
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

