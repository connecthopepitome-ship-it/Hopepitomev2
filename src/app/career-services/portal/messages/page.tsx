'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { subscribeMessages, sendMessage, logActivity } from '@/lib/firebase/firestore';
import type { CareerMessage } from '@/lib/career/types';
import { MessageSquare, Send, User, ShieldCheck } from 'lucide-react';

export default function ClientMessagesPage() {
  const { client, user } = useCareerAuth();
  const [messages, setMessages] = useState<CareerMessage[]>([]);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!client?.id) return;
    const unsub = subscribeMessages(client.id, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, [client?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id || !content.trim()) return;

    setSending(true);
    const msgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}`;

    const newMsg: CareerMessage = {
      id: msgId,
      clientId: client.id,
      senderUid: client.id,
      senderName: client.fullName,
      senderRole: 'CLIENT',
      content: content.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await sendMessage(newMsg);
      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'MESSAGE_SENT',
        entityType: 'CLIENT',
        entityId: client.id,
        summary: `Sent message to career consultant: "${content.substring(0, 30)}..."`,
      });
      setContent('');
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Direct Communication
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Consultant Messages
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Ask clarifying questions, share application deadlines, or discuss industry targeting directly with your team.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#777781] bg-[#F7F5F0] px-3 py-1.5 rounded-xl border border-[#E6E2DC]">
            <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
            <span>Private Career Channel</span>
          </div>
        </div>

        {/* Chat Stream Card */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col h-[560px] overflow-hidden">
          {/* Chat Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#777781] space-y-2">
                <MessageSquare className="w-8 h-8 text-[#8172A8] mx-auto" />
                <p className="font-semibold text-[#17243B]">No messages yet</p>
                <p className="max-w-xs mx-auto">
                  Type a question below to connect with your assigned career specialist or resume architect.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isClient = m.senderRole === 'CLIENT';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#777781]">
                      <span className="font-semibold text-[#17243B]">{m.senderName}</span>
                      <span>•</span>
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isClient
                          ? 'bg-[#17243B] text-white rounded-tr-none'
                          : 'bg-[#F7F5F0] text-[#17243B] rounded-tl-none border border-[#E6E2DC]'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-[#E6E2DC] bg-[#FFFFFF]">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message to the consulting team..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/40 focus:border-[#8172A8] focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

