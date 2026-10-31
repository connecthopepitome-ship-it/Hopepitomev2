'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { saveCareerProfile } from '@/lib/firebase/firestore';
import type {
  CareerProfileData,
  EmploymentRecord,
  EducationRecord,
  CertificationRecord,
  ProjectRecord,
  SkillItem,
} from '@/lib/career/types';
import {
  User,
  Target,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Rocket,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function CareerOnboardingWizardPage() {
  const { client, profile, refreshProfile } = useCareerAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CareerProfileData>({
    clientId: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedInUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    careerStage: 'Mid-Level',
    targetRoleTitles: [''],
    targetIndustries: [''],
    targetGeographies: [''],
    targetSalaryExpectation: '',
    preferredWorkType: 'Remote',
    employmentHistory: [],
    education: [],
    certifications: [],
    skills: {
      technical: [],
      functional: [],
      leadership: [],
      toolsAndPlatforms: [],
    },
    projects: [],
    personalStatement: '',
    status: 'DRAFT',
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (profile && profile.clientId) {
      setFormData({
        ...profile,
        targetRoleTitles: profile.targetRoleTitles?.length ? profile.targetRoleTitles : [''],
        targetIndustries: profile.targetIndustries?.length ? profile.targetIndustries : [''],
        targetGeographies: profile.targetGeographies?.length ? profile.targetGeographies : [''],
        employmentHistory: profile.employmentHistory || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
        skills: profile.skills || {
          technical: [],
          functional: [],
          leadership: [],
          toolsAndPlatforms: [],
        },
        projects: profile.projects || [],
      });
    } else if (client) {
      setFormData((prev) => ({
        ...prev,
        clientId: client.id,
        fullName: client.fullName || '',
        email: client.email || '',
      }));
    }
  }, [profile, client]);

  const handleSaveDraft = async (statusOverride?: CareerProfileData['status']) => {
    if (!client?.id) return;
    setSaving(true);
    setSavedNotice(null);

    const updated: CareerProfileData = {
      ...formData,
      clientId: client.id,
      status: statusOverride || formData.status || 'DRAFT',
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCareerProfile(updated);
      await refreshProfile();
      setSavedNotice(
        statusOverride === 'SUBMITTED'
          ? 'Career profile submitted successfully for consultant review!'
          : 'Draft saved securely.'
      );
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (e) {
      console.error('Error saving profile:', e);
      setSavedNotice('Error saving changes. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  // Helper generators
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Repeatable Employment Handlers
  const addEmployment = () => {
    const newEntry: EmploymentRecord = {
      id: generateId(),
      company: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      responsibilities: '',
      keyAchievements: '',
      technologiesUsed: '',
    };
    setFormData((prev) => ({
      ...prev,
      employmentHistory: [newEntry, ...prev.employmentHistory],
    }));
  };

  const removeEmployment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((e) => e.id !== id),
    }));
  };

  const updateEmployment = (id: string, field: keyof EmploymentRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Repeatable Education Handlers
  const addEducation = () => {
    const newEntry: EducationRecord = {
      id: generateId(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationYear: '',
      honours: '',
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEntry],
    }));
  };

  const removeEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof EducationRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Repeatable Certifications Handlers
  const addCertification = () => {
    const newEntry: CertificationRecord = {
      id: generateId(),
      title: '',
      issuingOrganization: '',
      issueDate: '',
      credentialUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newEntry],
    }));
  };

  const removeCertification = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  const updateCertification = (id: string, field: keyof CertificationRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Skills Handlers
  const addSkill = (category: keyof CareerProfileData['skills'], name: string) => {
    if (!name.trim()) return;
    const newSkill: SkillItem = { name: name.trim(), level: 'Advanced' };
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills[category] || []), newSkill],
      },
    }));
  };

  const removeSkill = (category: keyof CareerProfileData['skills'], index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  };

  // Projects Handlers
  const addProject = () => {
    const newEntry: ProjectRecord = {
      id: generateId(),
      title: '',
      description: '',
      role: '',
      impactMetrics: '',
      projectUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newEntry],
    }));
  };

  const removeProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateProject = (id: string, field: keyof ProjectRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Career Objectives', icon: Target },
    { number: 3, title: 'Employment History', icon: Briefcase },
    { number: 4, title: 'Education', icon: GraduationCap },
    { number: 5, title: 'Certifications', icon: Award },
    { number: 6, title: 'Skills Matrix', icon: Layers },
    { number: 7, title: 'Projects & Submission', icon: Rocket },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header & Autosave Indicator */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Intelligent Intake Wizard
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#F7F5F0] text-[#17243B] border border-[#E6E2DC]">
                Step {currentStep} of 7
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-1">
              Your Professional Career Profile
            </h1>
            <p className="text-xs text-[#777781] mt-0.5">
              Complete each stage so our senior resume consultants and ATS writers can articulate your strongest impact.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {savedNotice && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {savedNotice}
              </span>
            )}
            <button
              onClick={() => handleSaveDraft()}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-semibold text-[#17243B] transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = currentStep === st.number;
              const isPast = currentStep > st.number;
              return (
                <button
                  key={st.number}
                  onClick={() => setCurrentStep(st.number)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#17243B] text-white shadow-sm'
                      : isPast
                      ? 'text-[#17243B] bg-[#F7F5F0] hover:bg-[#E6E2DC]'
                      : 'text-[#777781] hover:text-[#17243B]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-[#8172A8] text-white' : isPast ? 'bg-[#17243B] text-white' : 'bg-[#E6E2DC] text-[#777781]'
                    }`}
                  >
                    {isPast ? '✓' : st.number}
                  </div>
                  <span className="whitespace-nowrap">{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Steps Card */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          {/* STEP 1: Personal & Contact Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#17243B]">1. Personal & Contact Details</h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Basic details for your resume header. We never ask for sensitive PII (such as national IDs or birthdates).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="eleanor@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Current Location (City, Country)</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. Sydney, Australia or London, UK"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formData.linkedInUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Portfolio or Personal Website URL</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="https://yourdomain.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Career Objectives */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#17243B]">2. Target Career Objectives & Preferences</h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Helps our writers calibrate your executive summary and align industry-specific keywords.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Current Career Stage</label>
                  <select
                    value={formData.careerStage}
                    onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                  >
                    <option value="Entry-Level">Entry-Level (0-2 years)</option>
                    <option value="Mid-Level">Mid-Level Professional (3-7 years)</option>
                    <option value="Senior">Senior Specialist / Team Lead (8-14 years)</option>
                    <option value="Executive">Executive / Director / C-Suite (15+ years)</option>
                    <option value="Transitioning">Career Pivot / Industry Transition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Work Arrangement Preference</label>
                  <select
                    value={formData.preferredWorkType}
                    onChange={(e) => setFormData({ ...formData, preferredWorkType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                  >
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid (Remote + Office)</option>
                    <option value="On-site">On-site</option>
                    <option value="Flexible">Flexible / Open</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Primary Target Job Titles (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.targetRoleTitles.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetRoleTitles: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. Senior Product Manager, Head of Product, Principal Solution Consultant"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Target Industries or Sectors
                  </label>
                  <input
                    type="text"
                    value={formData.targetIndustries.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetIndustries: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. Enterprise SaaS, FinTech, Healthcare Technology, Consulting"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Target Geographies</label>
                  <input
                    type="text"
                    value={formData.targetGeographies.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetGeographies: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. Australia, Singapore, United Kingdom, Global Remote"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Target Compensation / Salary (Optional)</label>
                  <input
                    type="text"
                    value={formData.targetSalaryExpectation || ''}
                    onChange={(e) => setFormData({ ...formData, targetSalaryExpectation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    placeholder="e.g. $140,000 - $165,000 AUD"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Employment History */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">3. Employment & Professional Experience</h3>
                  <p className="text-xs text-[#777781] mt-0.5">
                    Add your work history starting with your most recent position.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEmployment}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17243B] text-white text-xs font-medium hover:bg-[#292D36] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Position</span>
                </button>
              </div>

              {formData.employmentHistory.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-[#E6E2DC] rounded-xl p-6">
                  <Briefcase className="w-8 h-8 text-[#8172A8] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#17243B]">No employment history added yet</p>
                  <p className="text-[11px] text-[#777781] mt-0.5 mb-3">
                    Click "Add Position" above to document your current and previous career roles.
                  </p>
                  <button
                    type="button"
                    onClick={addEmployment}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                  >
                    + Add First Role
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {formData.employmentHistory.map((job, idx) => (
                    <div key={job.id} className="p-5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                        <span className="text-xs font-bold text-[#17243B]">
                          Role #{idx + 1} — {job.jobTitle || 'New Position'} {job.company ? `at ${job.company}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEmployment(job.id)}
                          className="text-[#777781] hover:text-red-600 transition"
                          title="Remove position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Company / Organization</label>
                          <input
                            type="text"
                            value={job.company}
                            onChange={(e) => updateEmployment(job.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. Atlassian or Macquarie Group"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Job Title</label>
                          <input
                            type="text"
                            value={job.jobTitle}
                            onChange={(e) => updateEmployment(job.id, 'jobTitle', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. Senior Technical Lead"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Start Date (MM/YYYY)</label>
                          <input
                            type="text"
                            value={job.startDate}
                            onChange={(e) => updateEmployment(job.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. 03/2021"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">End Date</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              disabled={job.isCurrent}
                              value={job.isCurrent ? 'Present' : job.endDate || ''}
                              onChange={(e) => updateEmployment(job.id, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white disabled:bg-[#E6E2DC]/40"
                              placeholder="e.g. 10/2023"
                            />
                            <label className="flex items-center gap-1.5 shrink-0 text-[11px] text-[#17243B] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={job.isCurrent}
                                onChange={(e) => updateEmployment(job.id, 'isCurrent', e.target.checked)}
                                className="rounded text-[#8172A8]"
                              />
                              <span>Current</span>
                            </label>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">
                            Key Responsibilities
                          </label>
                          <textarea
                            rows={2}
                            value={job.responsibilities}
                            onChange={(e) => updateEmployment(job.id, 'responsibilities', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="Describe your core operational scope, team size, and responsibilities..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">
                            Key Achievements & Measurable Outcomes
                          </label>
                          <textarea
                            rows={3}
                            value={job.keyAchievements}
                            onChange={(e) => updateEmployment(job.id, 'keyAchievements', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="Detail your metrics, revenue generated, costs reduced, or projects delivered (e.g. Boosted customer retention by 34%, scaled microservices from 10k to 500k DAU)..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">
                            Technologies, Tools & Frameworks Used
                          </label>
                          <input
                            type="text"
                            value={job.technologiesUsed || ''}
                            onChange={(e) => updateEmployment(job.id, 'technologiesUsed', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. AWS, Python, Docker, Salesforce CRM, Figma, Jira"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Education */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">4. Education & Academic Background</h3>
                  <p className="text-xs text-[#777781] mt-0.5">
                    Degrees, diplomas, and academic credentials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17243B] text-white text-xs font-medium hover:bg-[#292D36] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {formData.education.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-[#E6E2DC] rounded-xl p-6">
                  <GraduationCap className="w-8 h-8 text-[#8172A8] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#17243B]">No education records entered</p>
                  <p className="text-[11px] text-[#777781] mt-0.5 mb-3">
                    Click "Add Degree" to document your qualifications.
                  </p>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                  >
                    + Add Academic Degree
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                        <span className="text-xs font-bold text-[#17243B]">
                          {edu.degree || 'Degree'} {edu.institution ? `at ${edu.institution}` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="text-[#777781] hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">University / Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. University of New South Wales"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Degree Title</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. Bachelor of Commerce / BSc Computer Science"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Field of Study</label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. Information Systems & Economics"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Graduation Year</label>
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. 2019"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Certifications */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">5. Professional Certifications & Licences</h3>
                  <p className="text-xs text-[#777781] mt-0.5">
                    Recognised industry credentials (e.g. PMP, AWS Certified Solutions Architect, Scrum Master, CFA).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCertification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17243B] text-white text-xs font-medium hover:bg-[#292D36] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              {formData.certifications.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-[#E6E2DC] rounded-xl p-6">
                  <Award className="w-8 h-8 text-[#8172A8] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#17243B]">No certifications listed</p>
                  <p className="text-[11px] text-[#777781] mt-0.5 mb-3">
                    If you hold industry accreditations, listing them elevates ATS credibility.
                  </p>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                  >
                    + Add Certification
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                        <span className="text-xs font-bold text-[#17243B]">
                          {cert.title || 'Certification'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCertification(cert.id)}
                          className="text-[#777781] hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. AWS Certified Solutions Architect - Professional"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Issuing Body</label>
                          <input
                            type="text"
                            value={cert.issuingOrganization}
                            onChange={(e) => updateCertification(cert.id, 'issuingOrganization', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. Amazon Web Services (AWS)"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Date Acquired</label>
                          <input
                            type="text"
                            value={cert.issueDate}
                            onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. 2023"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Verification URL / Credential ID</label>
                          <input
                            type="text"
                            value={cert.credentialUrl || ''}
                            onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                            placeholder="e.g. https://credly.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Skills Matrix */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#17243B]">6. Categorized Skills Matrix</h3>
                <p className="text-xs text-[#777781] mt-0.5">
                  Categorise your capabilities to allow our ATS optimisers to map exact search phrases into your resume.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#17243B]">Technical & Engineering Skills</h4>
                    <span className="text-[11px] text-[#777781]">Languages, frameworks, architecture paradigms</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.technical.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill('technical', idx)}
                        className="text-[#777781] hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-tech-skill"
                    placeholder="Type skill & press Enter (e.g. Next.js, Cloud Architecture, Python)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.currentTarget as HTMLInputElement).value;
                        addSkill('technical', val);
                        (e.currentTarget as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                  />
                </div>
              </div>

              {/* Functional Skills */}
              <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#17243B]">Functional & Domain Expertise</h4>
                  <span className="text-[11px] text-[#777781]">Business analysis, P&L management, product strategy</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.functional.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill('functional', idx)}
                        className="text-[#777781] hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type domain expertise & press Enter (e.g. Product Strategy, Stakeholder Alignment)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.currentTarget as HTMLInputElement).value;
                      addSkill('functional', val);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                />
              </div>

              {/* Leadership Skills */}
              <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#17243B]">Leadership & Management</h4>
                  <span className="text-[11px] text-[#777781]">Executive coaching, hiring, cross-functional orchestration</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.leadership.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill('leadership', idx)}
                        className="text-[#777781] hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type leadership skill & press Enter (e.g. Cross-Functional Team Leadership)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.currentTarget as HTMLInputElement).value;
                      addSkill('leadership', val);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                />
              </div>

              {/* Tools & Software */}
              <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#17243B]">Tools & Platforms</h4>
                  <span className="text-[11px] text-[#777781]">SaaS applications, development platforms, BI tools</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.toolsAndPlatforms.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill('toolsAndPlatforms', idx)}
                        className="text-[#777781] hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type tool & press Enter (e.g. Jira, GitHub, Tableau, HubSpot, Salesforce)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.currentTarget as HTMLInputElement).value;
                      addSkill('toolsAndPlatforms', val);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Projects & Submission */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">7. Notable Projects & Final Submission</h3>
                  <p className="text-xs text-[#777781] mt-0.5">
                    Highlight 1-3 landmark projects that demonstrate your tangible executive or technical impact.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17243B] text-white text-xs font-medium hover:bg-[#292D36] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {formData.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                    <span className="text-xs font-bold text-[#17243B]">
                      {proj.title || 'Project Highlight'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="text-[#777781] hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        placeholder="e.g. Enterprise Cloud ERP Migration"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Your Specific Role</label>
                      <input
                        type="text"
                        value={proj.role}
                        onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        placeholder="e.g. Lead Solution Architect"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Brief Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        placeholder="What problem did this project solve for the organisation?"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Key Impact Metrics</label>
                      <input
                        type="text"
                        value={proj.impactMetrics || ''}
                        onChange={(e) => updateProject(proj.id, 'impactMetrics', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        placeholder="e.g. Completed 2 months ahead of schedule, reducing annual AWS spend by $180,000"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Personal statement */}
              <div className="pt-4 border-t border-[#E6E2DC]/80">
                <label className="block text-xs font-semibold text-[#17243B] mb-1">
                  Additional Notes or Personal Statement for our Writing Team (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.personalStatement || ''}
                  onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                  placeholder="Tell our specialists about any gaps in employment, specific career narratives you wish to emphasize, or particular companies you are targeting..."
                />
              </div>

              {/* Submission Callout */}
              <div className="bg-[#17243B] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#A69ACB]" />
                    <span>Ready to submit for Specialist Review?</span>
                  </h4>
                  <p className="text-xs text-white/80 mt-1 max-w-lg leading-relaxed">
                    Submitting locks this intake snapshot and assigns our career team to review your background. You can still revise details at any point.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveDraft('SUBMITTED')}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold transition shrink-0 shadow-sm"
                >
                  {saving ? 'Submitting...' : 'Submit Profile for Review'}
                </button>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#E6E2DC]/80">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#17243B] hover:bg-[#F7F5F0] transition disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs text-[#777781] hidden sm:inline">
              Step {currentStep} of 7
            </span>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  setCurrentStep((prev) => Math.min(7, prev + 1));
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition shadow-sm"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSaveDraft('SUBMITTED')}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold transition shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Complete & Submit'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

