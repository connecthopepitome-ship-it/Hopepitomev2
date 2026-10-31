'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { subscribeClientInvoices } from '@/lib/firebase/firestore';
import type { CareerInvoice } from '@/lib/career/types';
import { Receipt, CheckCircle2, Clock, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ClientInvoicesPage() {
  const { client } = useCareerAuth();
  const [invoices, setInvoices] = useState<CareerInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client?.id) return;
    const unsub = subscribeClientInvoices(client.id, (invList) => {
      setInvoices(invList);
      setLoading(false);
    });
    return () => unsub();
  }, [client?.id]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Billing & Receipts
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Quotations & Invoices
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Review issued service quotes, itemized deliverables, and receipt payment acknowledgements.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#777781] bg-[#F7F5F0] px-3 py-1.5 rounded-xl border border-[#E6E2DC]">
            <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
            <span>Secure Financial Accounting</span>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <Receipt className="w-10 h-10 text-[#8172A8] mx-auto" />
              <h3 className="text-sm font-bold text-[#17243B]">
                No invoices issued yet
              </h3>
              <p className="text-xs text-[#777781] max-w-sm mx-auto">
                Invoices and payment receipts will appear here once your service scope is confirmed with your consultant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6E2DC]/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17243B]">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#777781] block mt-0.5">
                        Issued: {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#777781] block">Total Amount</span>
                      <span className="text-base font-bold text-[#17243B]">
                        ${inv.total} USD
                      </span>
                    </div>
                  </div>

                  {/* Line items list */}
                  <div className="divide-y divide-[#E6E2DC]/40 text-xs">
                    {inv.items.map((it) => (
                      <div key={it.id} className="py-2 flex items-center justify-between">
                        <span className="text-[#292D36]">{it.description}</span>
                        <span className="font-semibold text-[#17243B]">${it.total}</span>
                      </div>
                    ))}
                  </div>

                  {inv.paidAt && (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Paid on {new Date(inv.paidAt).toLocaleDateString()} via {inv.paymentMethod || 'Direct Bank/Stripe'} (Ref: {inv.transactionReference || 'REC-CONFIRMED'})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

