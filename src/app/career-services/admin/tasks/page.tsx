'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllTasks,
  saveTask,
  subscribeAllOrders,
  logActivity,
} from '@/lib/firebase/firestore';
import type { CareerTask, TaskStatus, TaskPriority, ServiceOrder } from '@/lib/career/types';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  User,
  Trash2,
} from 'lucide-react';

export default function AdminTasksPage() {
  const { adminProfile, role } = useAdminAuth();
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubTasks = subscribeAllTasks((list) => {
      setTasks(list);
      setLoading(false);
    });

    const unsubOrders = subscribeAllOrders((list) => {
      setOrders(list);
      if (list.length > 0 && !orderId) {
        setOrderId(list[0].id);
      }
    });

    return () => {
      unsubTasks();
      unsubOrders();
    };
  }, [orderId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const taskId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `task_${Date.now()}`;
    const selectedOrder = orders.find((o) => o.id === orderId);

    const newTask: CareerTask = {
      id: taskId,
      orderId: orderId || 'general',
      orderNumber: selectedOrder?.orderNumber || 'GENERAL-TASK',
      clientId: selectedOrder?.clientId || 'internal',
      title: title.trim(),
      assignedToName: assignedName.trim() || 'Unassigned Staff',
      status: 'TODO',
      priority,
      dueDate: dueDate || 'Within 48h',
      checklist: [
        { id: '1', text: 'Analyze initial brief & keyword requirements', completed: false },
        { id: '2', text: 'Draft executive summary & core competencies', completed: false },
        { id: '3', text: 'Peer-review ATS parsing format', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    try {
      await saveTask(newTask);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'TASK_CREATED',
        entityType: 'TASK',
        entityId: taskId,
        summary: `Created task: "${title}" assigned to ${assignedName || 'staff'}`,
      });

      setShowCreateModal(false);
      setTitle('');
      setAssignedName('');
      alert('Task created successfully.');
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChecklist = async (task: CareerTask, itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const allDone = updatedChecklist.every((i) => i.completed);
    const updatedTask: CareerTask = {
      ...task,
      checklist: updatedChecklist,
      status: allDone ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: allDone ? new Date().toISOString() : undefined,
    };

    try {
      await saveTask(updatedTask);
    } catch (e) {
      console.error('Error updating task checklist:', e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Staff Work Allocation
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Task Checklist Board
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Delegate action items, review checklist milestones, and track writer accountability.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-[#E6E2DC] text-center text-xs text-[#777781]">
            No assigned tasks currently open. Click "Assign New Task" to begin delegating work.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const completedCount = task.checklist.filter((c) => c.completed).length;
              return (
                <div
                  key={task.id}
                  className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)] space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono text-[#8172A8] font-bold">
                        {task.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'URGENT'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#17243B] leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#777781] mt-1">
                      <User className="w-3.5 h-3.5 text-[#8172A8]" />
                      <span>{task.assignedToName}</span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </div>

                    {/* Interactive Checklist */}
                    <div className="mt-4 pt-3 border-t border-[#E6E2DC]/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#17243B]">
                        <span>Checklist</span>
                        <span>
                          {completedCount}/{task.checklist.length} Done
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {task.checklist.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-start gap-2 text-xs text-[#292D36] cursor-pointer hover:bg-[#F7F5F0]/50 p-1 rounded transition"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleChecklist(task, item.id)}
                              className="mt-0.5 rounded text-[#8172A8] focus:ring-[#8172A8]"
                            />
                            <span className={item.completed ? 'line-through text-[#777781]' : ''}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E6E2DC]/60 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        task.status === 'COMPLETED' ? 'text-emerald-700' : 'text-[#777781]'
                      }`}
                    >
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create New Task */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Assign Staff Task
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Related Service Order
                  </label>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
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
                    Task Title / Objective
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Conduct ATS Keyword Density Alignment"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Assignee Specialist Name
                  </label>
                  <input
                    type="text"
                    value={assignedName}
                    onChange={(e) => setAssignedName(e.target.value)}
                    placeholder="e.g. Rachel Adams (Resume Writer)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      placeholder="e.g. Tomorrow 5 PM"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
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
                    {saving ? 'Assigning...' : 'Create Task'}
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

