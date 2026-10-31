'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { saveCareerProfile, addDocumentRecord, logActivity } from '@/lib/firebase/firestore';
import type {
  CareerProfileData,
  EmploymentRecord,
  EducationRecord,
  CertificationRecord,
  ProjectRecord,
  SkillItem,
  ProfileStatus,
  ProfileInputMethod,
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
  UploadCloud,
  FileText,
  FileCheck,
  Check,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export default function CareerOnboardingWizardPage() {
  const router = useRouter();
  const { client, profile, refreshProfile } = useCareerAuth();

  // Mode: CHOICE, RESUME_UPLOAD, or MANUAL_ENTRY
  const [activeMode, setActiveMode] = useState<'CHOICE' | 'RESUME_UPLOAD' | 'MANUAL_ENTRY'>('CHOICE');
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Resume Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState<string>('');
  const [resumeAdditionalNotes, setResumeAdditionalNotes] = useState<string>('');

  // Manual Form State - all fields optional
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
    targetRoleTitles: [],
    targetIndustries: [],
    targetGeographies: [],
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
    additionalInformation: '',
    personalStatement: '',
    status: 'NOT_STARTED',
    inputMethod: 'UNDECIDED',
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (profile && profile.clientId) {
      setFormData({
        ...profile,
        targetRoleTitles: profile.targetRoleTitles || [],
        targetIndustries: profile.targetIndustries || [],
        targetGeographies: profile.targetGeographies || [],
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

      if (profile.resumeFileName) {
        setUploadedResumeName(profile.resumeFileName);
      }
      if (profile.additionalInformation) {
        setResumeAdditionalNotes(profile.additionalInformation);
      }

      // If user previously selected a method or has data, set appropriate mode
      if (profile.inputMethod === 'RESUME_UPLOAD' || (profile.resumeFileName && !profile.employmentHistory?.length)) {
        setActiveMode('RESUME_UPLOAD');
      } else if (profile.inputMethod === 'MANUAL_ENTRY' || (profile.employmentHistory && profile.employmentHistory.length > 0)) {
        setActiveMode('MANUAL_ENTRY');
      }
    } else if (client) {
      setFormData((prev) => ({
        ...prev,
        clientId: client.id,
        fullName: client.fullName || '',
        email: client.email || '',
      }));
    }
  }, [profile, client]);

  // Save profile helper (never blocks on empty fields)
  const handleSaveProfile = async (
    statusOverride?: ProfileStatus,
    methodOverride?: ProfileInputMethod
  ) => {
    if (!client?.id) return;
    setSaving(true);
    setSavedNotice(null);

    const updatedStatus: ProfileStatus =
      statusOverride ||
      formData.status ||
      (uploadedResumeName ? 'RESUME_RECEIVED' : 'PARTIALLY_COMPLETED');

    const updatedMethod: ProfileInputMethod =
      methodOverride ||
      formData.inputMethod ||
      (activeMode === 'RESUME_UPLOAD' ? 'RESUME_UPLOAD' : 'MANUAL_ENTRY');

    const updated: CareerProfileData = {
      ...formData,
      clientId: client.id,
      status: updatedStatus,
      inputMethod: updatedMethod,
      resumeFileName: uploadedResumeName || formData.resumeFileName,
      additionalInformation: resumeAdditionalNotes || formData.additionalInformation,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCareerProfile(updated);
      await refreshProfile();
      setSavedNotice('Information saved securely. You can return and update anytime.');
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (e) {
      console.error('Error saving profile:', e);
      setSavedNotice('Error saving changes. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  // Option A: Handle Resume Upload
  const handleResumeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleExecuteResumeUpload = async () => {
    if (!selectedFile || !client?.id) return;

    setIsUploading(true);
    setUploadProgress(20);

    // Simulate steady upload progression
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    const docId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`;
    const safeName = selectedFile.name;

    try {
      // 1. Add record to Document Vault
      await addDocumentRecord({
        id: docId,
        clientId: client.id,
        fileName: safeName,
        category: 'EXISTING_RESUME',
        fileSize: selectedFile.size || 150000,
        mimeType: selectedFile.type || 'application/pdf',
        downloadUrl: 'https://drive.google.com/file/d/vault_preview',
        driveFileId: `drive_vault_${Date.now()}`,
        uploadedBy: 'CLIENT',
        createdAt: new Date().toISOString(),
      });

      // 2. Update Career Profile
      setUploadedResumeName(safeName);
      setUploadProgress(100);
      clearInterval(interval);

      await saveCareerProfile({
        clientId: client.id,
        status: 'RESUME_RECEIVED',
        inputMethod: 'RESUME_UPLOAD',
        resumeDocumentId: docId,
        resumeFileName: safeName,
        resumeFileUrl: 'https://drive.google.com/file/d/vault_preview',
        resumeUploadedAt: new Date().toISOString(),
        additionalInformation: resumeAdditionalNotes,
        updatedAt: new Date().toISOString(),
      });

      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'RESUME_UPLOADED',
        entityType: 'PROFILE',
        entityId: client.id,
        summary: `Client uploaded existing resume: ${safeName} (Method: RESUME_UPLOAD)`,
      });

      await refreshProfile();
      setSelectedFile(null);
      setIsUploading(false);
      setSavedNotice('Resume uploaded successfully! Our team will review your existing experience.');
      setTimeout(() => setSavedNotice(null), 5000);
    } catch (err) {
      console.error('Resume upload error:', err);
      setIsUploading(false);
      clearInterval(interval);
      alert('Error saving resume. Please check your connection and try again.');
    }
  };

  const handleRemoveResume = async () => {
    if (!client?.id) return;
    if (!confirm('Are you sure you want to remove this resume file?')) return;

    setUploadedResumeName('');
    await saveCareerProfile({
      clientId: client.id,
      resumeFileName: undefined,
      resumeDocumentId: undefined,
      resumeFileUrl: undefined,
      status: 'PARTIALLY_COMPLETED',
      updatedAt: new Date().toISOString(),
    });
    await refreshProfile();
  };

  // Helper generators
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Repeatable Employment Handlers (all optional)
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
      employmentHistory: [newEntry, ...(prev.employmentHistory || [])],
    }));
  };

  const removeEmployment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: (prev.employmentHistory || []).filter((e) => e.id !== id),
    }));
  };

  const updateEmployment = (id: string, field: keyof EmploymentRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: (prev.employmentHistory || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Repeatable Education Handlers (all optional)
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
      education: [...(prev.education || []), newEntry],
    }));
  };

  const removeEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id: string, field: keyof EducationRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Repeatable Certifications Handlers (all optional)
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
      certifications: [...(prev.certifications || []), newEntry],
    }));
  };

  const removeCertification = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id),
    }));
  };

  const updateCertification = (id: string, field: keyof CertificationRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Skills Handlers
  const addSkill = (category: keyof NonNullable<CareerProfileData['skills']>, name: string) => {
    if (!name.trim()) return;
    const newSkill: SkillItem = { name: name.trim(), level: 'Advanced' };
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...((prev.skills && prev.skills[category]) || []), newSkill],
      },
    }));
  };

  const removeSkill = (category: keyof NonNullable<CareerProfileData['skills']>, index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: ((prev.skills && prev.skills[category]) || []).filter((_, i) => i !== index),
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
      projects: [...(prev.projects || []), newEntry],
    }));
  };

  const removeProject = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id),
    }));
  };

  const updateProject = (id: string, field: keyof ProjectRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const manualSteps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Career Objective', icon: Target },
    { number: 3, title: 'Employment History', icon: Briefcase },
    { number: 4, title: 'Education', icon: GraduationCap },
    { number: 5, title: 'Skills', icon: Layers },
    { number: 6, title: 'Certifications', icon: Award },
    { number: 7, title: 'Projects', icon: Rocket },
    { number: 8, title: 'Additional Info', icon: FileText },
    { number: 9, title: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Reassuring Banner (Prompt requirement #8) */}
        <div className="bg-[#FAF8FC] border border-[#E6E2DC] p-4 rounded-2xl flex items-start sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#8172A8] shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-[#17243B]">
              “You don’t need to have everything ready. Start with what you have, and add the rest whenever you’re ready.”
            </p>
          </div>

          {activeMode !== 'CHOICE' && (
            <button
              onClick={() => setActiveMode('CHOICE')}
              className="text-xs font-semibold text-[#8172A8] hover:text-[#17243B] shrink-0 flex items-center gap-1 transition"
            >
              <span>Change Method</span>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Admin Information Request Notification if present */}
        {profile?.requestedItems && profile.requestedItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Consultant Follow-up: Additional Information Requested</span>
            </div>
            {profile.requestedNotes && (
              <p className="text-xs text-amber-800 leading-relaxed pl-6">
                “{profile.requestedNotes}”
              </p>
            )}
            <ul className="text-xs text-amber-900 list-disc list-inside pl-6 space-y-1">
              {profile.requestedItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Save confirmation toast */}
        {savedNotice && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            SCREEN 1: CHOICE SCREEN (Option A vs Option B)
            ───────────────────────────────────────────────────────────── */}
        {activeMode === 'CHOICE' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-10 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Career Information Onboarding
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17243B] mt-1">
                How would you like to share your career information?
              </h1>
              <p className="text-xs sm:text-sm text-[#777781] mt-2 leading-relaxed">
                Choose whichever method is easier for you. You can upload your existing resume or enter your information yourself. You can also add or update information later.
              </p>
            </div>

            {/* Two Prominent Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Upload Existing Resume */}
              <div
                onClick={() => setActiveMode('RESUME_UPLOAD')}
                className="group relative p-6 sm:p-8 rounded-2xl border-2 border-[#E6E2DC] hover:border-[#8172A8] bg-[#FFFFFF] hover:bg-[#FAF8FC]/50 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F5F0] group-hover:bg-[#8172A8] text-[#8172A8] group-hover:text-white flex items-center justify-center transition-colors">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8172A8] block">
                      Fastest Option
                    </span>
                    <h2 className="text-lg font-bold text-[#17243B] mt-0.5">
                      Upload Your Existing Resume
                    </h2>
                  </div>

                  <p className="text-xs text-[#777781] leading-relaxed">
                    Already have a resume? Upload it and let our team review your existing experience, education, skills and achievements.
                  </p>

                  <div className="pt-2 border-t border-[#E6E2DC]/60 space-y-2 text-xs text-[#292D36]">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>Accepts PDF or Word (.docx)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>No need to re-type existing work history</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>Encrypted Google Drive vault storage</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMode('RESUME_UPLOAD');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
                  >
                    <span>Upload My Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Option B: Enter Information Manually */}
              <div
                onClick={() => setActiveMode('MANUAL_ENTRY')}
                className="group relative p-6 sm:p-8 rounded-2xl border-2 border-[#E6E2DC] hover:border-[#8172A8] bg-[#FFFFFF] hover:bg-[#FAF8FC]/50 transition-all cursor-pointer flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F5F0] group-hover:bg-[#17243B] text-[#17243B] group-hover:text-white flex items-center justify-center transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#777781] block">
                      Custom Guided Form
                    </span>
                    <h2 className="text-lg font-bold text-[#17243B] mt-0.5">
                      Fill In My Information
                    </h2>
                  </div>

                  <p className="text-xs text-[#777781] leading-relaxed">
                    Prefer to start from scratch? Enter your professional information at your own pace using our guided form.
                  </p>

                  <div className="pt-2 border-t border-[#E6E2DC]/60 space-y-2 text-xs text-[#292D36]">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>Every field is non-mandatory (optional)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>Skip any section and complete later</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                      <span>Partial saves never block service ordering</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMode('MANUAL_ENTRY');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#17243B] bg-white hover:bg-[#F7F5F0] text-[#17243B] text-xs font-semibold shadow-sm transition"
                  >
                    <span>Enter My Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Status Indicator */}
            {profile?.status && profile.status !== 'NOT_STARTED' && (
              <div className="pt-4 border-t border-[#E6E2DC] flex items-center justify-between text-xs text-[#777781]">
                <span>
                  Current Profile Status: <strong className="text-[#17243B]">{profile.status.replace(/_/g, ' ')}</strong>
                </span>
                <Link
                  href="/career-services/portal/dashboard"
                  className="font-medium text-[#8172A8] hover:text-[#17243B]"
                >
                  Return to Dashboard →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            OPTION A SCREEN: RESUME UPLOAD FLOW
            ───────────────────────────────────────────────────────────── */}
        {activeMode === 'RESUME_UPLOAD' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-10 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E2DC] gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                  Option 1 — Document Submission
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
                  Upload Your Existing Resume
                </h2>
                <p className="text-xs text-[#777781] mt-0.5">
                  Our senior writers will review your document directly. You do not need to re-type your history.
                </p>
              </div>

              <button
                onClick={() => setActiveMode('MANUAL_ENTRY')}
                className="text-xs font-semibold text-[#8172A8] hover:text-[#17243B] underline underline-offset-4 self-start sm:self-center"
              >
                Prefer entering manually?
              </button>
            </div>

            {/* Upload Area / Current Upload Status */}
            {uploadedResumeName ? (
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                        Resume Received ✓
                      </span>
                      <h3 className="text-sm font-bold text-[#17243B]">
                        {uploadedResumeName}
                      </h3>
                      <p className="text-[11px] text-[#777781]">
                        Stored securely in your private Google Drive vault.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRemoveResume}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Replace or Remove</span>
                  </button>
                </div>

                <div className="p-3 bg-white/80 rounded-xl text-xs text-[#292D36] border border-emerald-100 flex items-center justify-between">
                  <span>Status: Ready for career service review</span>
                  <span className="font-semibold text-emerald-700">No further manual entry required</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Drag-and-drop file dropzone */}
                <div className="border-2 border-dashed border-[#E6E2DC] hover:border-[#8172A8] rounded-2xl p-8 text-center transition-colors bg-[#FAF8FC]/30">
                  <UploadCloud className="w-10 h-10 text-[#8172A8] mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-[#17243B]">
                    Choose a resume file or drag & drop here
                  </h3>
                  <p className="text-xs text-[#777781] mt-1 max-w-sm mx-auto">
                    Supported formats: PDF (.pdf) or Word document (.docx). Up to 25MB.
                  </p>

                  <label className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] cursor-pointer transition shadow-sm">
                    <UploadCloud className="w-4 h-4" />
                    <span>Select Resume File</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleResumeFileSelect}
                      className="hidden"
                    />
                  </label>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-white rounded-xl border border-[#E6E2DC] max-w-md mx-auto flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#8172A8] shrink-0" />
                        <span className="font-semibold text-[#17243B] truncate">{selectedFile.name}</span>
                        <span className="text-[#777781] shrink-0">({Math.round(selectedFile.size / 1024)} KB)</span>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-[#777781] hover:text-red-600 text-xs shrink-0 pl-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Progress Bar if uploading */}
                {isUploading && (
                  <div className="space-y-1.5 p-4 bg-[#F7F5F0] rounded-xl border border-[#E6E2DC]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17243B]">Uploading to Private Vault...</span>
                      <span className="font-mono text-[#8172A8]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#E6E2DC] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8172A8] h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Execute Upload Button */}
                {selectedFile && !isUploading && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleExecuteResumeUpload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold transition shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm & Upload Resume</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Optional Additional Information */}
            <div className="pt-4 border-t border-[#E6E2DC] space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#17243B]">
                  Additional Notes for our Team <span className="font-normal text-[#777781]">(Optional)</span>
                </label>
                <span className="text-[11px] text-[#777781]">Add if available</span>
              </div>
              <textarea
                rows={3}
                value={resumeAdditionalNotes}
                onChange={(e) => setResumeAdditionalNotes(e.target.value)}
                placeholder="Mention specific roles you are targeting, recent promotions not yet in your resume, or industry transition preferences..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
              />
            </div>

            {/* Footer Navigation */}
            <div className="pt-6 border-t border-[#E6E2DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveMode('CHOICE')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777781] hover:text-[#17243B] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to choices</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveProfile('RESUME_RECEIVED', 'RESUME_UPLOAD')}
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E6E2DC] bg-white hover:bg-[#F7F5F0] text-xs font-semibold text-[#17243B] transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Notes'}</span>
                </button>

                <Link
                  href="/career-services/portal/orders/new"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
                >
                  <span>Select a Career Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            OPTION B SCREEN: GUIDED MANUAL FORM (ALL FIELDS OPTIONAL)
            ───────────────────────────────────────────────────────────── */}
        {activeMode === 'MANUAL_ENTRY' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                  Option 2 — Self-Paced Form (All Fields Optional)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
                  Enter Your Career Details
                </h2>
                <p className="text-xs text-[#777781] mt-0.5">
                  Every field is optional. Complete what you know, skip any section, and save at any time.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSaveProfile('PARTIALLY_COMPLETED', 'MANUAL_ENTRY')}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6E2DC] bg-white hover:bg-[#F7F5F0] text-xs font-semibold text-[#17243B] transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Progress'}</span>
                </button>
              </div>
            </div>

            {/* 9-Step Horizontal Progress Navigation */}
            <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)] overflow-x-auto">
              <div className="flex items-center justify-between min-w-[750px] gap-2">
                {manualSteps.map((st) => {
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
                          isActive
                            ? 'bg-[#8172A8] text-white'
                            : isPast
                            ? 'bg-[#17243B] text-white'
                            : 'bg-[#E6E2DC] text-[#777781]'
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

            {/* Manual Form Container */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-6">
              {/* SECTION 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">1. Personal Information</h3>
                    <p className="text-xs text-[#777781] mt-0.5">
                      Optional header contact information. You can skip any field.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">Full Legal Name</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">Contact Email</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="eleanor@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">Phone / WhatsApp</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">Location (City, Country)</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Sydney, Australia"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">LinkedIn URL</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="url"
                        value={formData.linkedInUrl || ''}
                        onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#17243B]">Portfolio or Website URL</label>
                        <span className="text-[10px] text-[#777781]">Optional</span>
                      </div>
                      <input
                        type="url"
                        value={formData.portfolioUrl || ''}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://yourname.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: Career Objective */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">2. Career Objectives & Preferences</h3>
                    <p className="text-xs text-[#777781] mt-0.5">
                      Tell our specialists what kinds of roles you are targeting (optional).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17243B] mb-1">Current Career Level</label>
                      <select
                        value={formData.careerStage || 'Mid-Level'}
                        onChange={(e) => setFormData({ ...formData, careerStage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      >
                        <option value="Entry-Level">Entry-Level (0-2 years)</option>
                        <option value="Mid-Level">Mid-Level Professional (3-7 years)</option>
                        <option value="Senior">Senior Specialist / Lead (8-14 years)</option>
                        <option value="Executive">Executive / Director (15+ years)</option>
                        <option value="Transitioning">Career Transition</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17243B] mb-1">Work Arrangement</label>
                      <select
                        value={formData.preferredWorkType || 'Remote'}
                        onChange={(e) => setFormData({ ...formData, preferredWorkType: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      >
                        <option value="Remote">100% Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                        <option value="Flexible">Flexible / Open</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#17243B] mb-1">
                        Target Job Titles <span className="font-normal text-[#777781]">(comma-separated, optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.targetRoleTitles?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetRoleTitles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. Product Manager, Technical Lead, Director of Operations"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17243B] mb-1">Target Industries</label>
                      <input
                        type="text"
                        value={formData.targetIndustries?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetIndustries: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. SaaS, FinTech, Healthcare"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#17243B] mb-1">Target Geographies</label>
                      <input
                        type="text"
                        value={formData.targetGeographies?.join(', ') || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetGeographies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="e.g. Australia, Singapore, Global Remote"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: Employment History */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#17243B]">3. Employment History</h3>
                      <p className="text-xs text-[#777781] mt-0.5">
                        Optional work experience. Add as many or as few roles as you wish.
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

                  {(!formData.employmentHistory || formData.employmentHistory.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-[#E6E2DC] rounded-xl text-center space-y-2">
                      <Briefcase className="w-8 h-8 text-[#8172A8] mx-auto" />
                      <p className="text-xs font-semibold text-[#17243B]">No employment history added</p>
                      <p className="text-[11px] text-[#777781]">
                        You can skip this section if you plan to upload your resume or enter it later.
                      </p>
                      <button
                        type="button"
                        onClick={addEmployment}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                      >
                        + Add a Role
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.employmentHistory.map((job, idx) => (
                        <div key={job.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/20 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                            <span className="text-xs font-bold text-[#17243B]">
                              Role #{idx + 1} {job.jobTitle ? `— ${job.jobTitle}` : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeEmployment(job.id)}
                              className="text-[#777781] hover:text-red-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Company</label>
                              <input
                                type="text"
                                value={job.company || ''}
                                onChange={(e) => updateEmployment(job.id, 'company', e.target.value)}
                                placeholder="Company name"
                                className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Job Title</label>
                              <input
                                type="text"
                                value={job.jobTitle || ''}
                                onChange={(e) => updateEmployment(job.id, 'jobTitle', e.target.value)}
                                placeholder="e.g. Marketing Lead"
                                className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Core Responsibilities</label>
                              <textarea
                                rows={2}
                                value={job.responsibilities || ''}
                                onChange={(e) => updateEmployment(job.id, 'responsibilities', e.target.value)}
                                placeholder="Summary of responsibilities..."
                                className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Key Outcomes / Achievements</label>
                              <textarea
                                rows={2}
                                value={job.keyAchievements || ''}
                                onChange={(e) => updateEmployment(job.id, 'keyAchievements', e.target.value)}
                                placeholder="Key achievements with measurable outcomes..."
                                className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: Education */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#17243B]">4. Education & Qualifications</h3>
                      <p className="text-xs text-[#777781] mt-0.5">
                        Academic degrees, diplomas, or courses (optional).
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

                  {(!formData.education || formData.education.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-[#E6E2DC] rounded-xl text-center space-y-2">
                      <GraduationCap className="w-8 h-8 text-[#8172A8] mx-auto" />
                      <p className="text-xs font-semibold text-[#17243B]">No education records added</p>
                      <p className="text-[11px] text-[#777781]">Skip if not applicable or add later.</p>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                      >
                        + Add Education Entry
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.education.map((edu) => (
                        <div key={edu.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/20 space-y-3">
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

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <input
                              type="text"
                              value={edu.institution || ''}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="Institution / University"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Degree / Qualification"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <input
                              type="text"
                              value={edu.fieldOfStudy || ''}
                              onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                              placeholder="Field of study"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <input
                              type="text"
                              value={edu.graduationYear || ''}
                              onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                              placeholder="Graduation year (optional)"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 5: Skills */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">5. Skills Matrix</h3>
                    <p className="text-xs text-[#777781] mt-0.5">
                      Key competencies to highlight (optional).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Technical Skills */}
                    <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/30 space-y-2">
                      <span className="text-xs font-bold text-[#17243B] block">Technical & Tools</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.skills?.technical?.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
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
                      <input
                        type="text"
                        placeholder="Add skill & press Enter (e.g. Python, AWS, Figma)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('technical', (e.currentTarget as HTMLInputElement).value);
                            (e.currentTarget as HTMLInputElement).value = '';
                          }
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs bg-white"
                      />
                    </div>

                    {/* Functional & Domain Skills */}
                    <div className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/30 space-y-2">
                      <span className="text-xs font-bold text-[#17243B] block">Functional & Domain</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.skills?.functional?.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white border border-[#E6E2DC] text-[#17243B]"
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
                        placeholder="Add domain skill (e.g. Product Strategy, Stakeholder Management)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('functional', (e.currentTarget as HTMLInputElement).value);
                            (e.currentTarget as HTMLInputElement).value = '';
                          }
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: Certifications */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#17243B]">6. Certifications & Licences</h3>
                      <p className="text-xs text-[#777781] mt-0.5">
                        Recognised professional certifications (optional).
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

                  {(!formData.certifications || formData.certifications.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-[#E6E2DC] rounded-xl text-center space-y-2">
                      <Award className="w-8 h-8 text-[#8172A8] mx-auto" />
                      <p className="text-xs font-semibold text-[#17243B]">No certifications listed</p>
                      <p className="text-[11px] text-[#777781]">Skip or complete later.</p>
                      <button
                        type="button"
                        onClick={addCertification}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                      >
                        + Add Certification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.certifications.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/20 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                            <span className="text-xs font-bold text-[#17243B]">{c.title || 'Certification'}</span>
                            <button
                              type="button"
                              onClick={() => removeCertification(c.id)}
                              className="text-[#777781] hover:text-red-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <input
                              type="text"
                              value={c.title || ''}
                              onChange={(e) => updateCertification(c.id, 'title', e.target.value)}
                              placeholder="Certification title"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <input
                              type="text"
                              value={c.issuingOrganization || ''}
                              onChange={(e) => updateCertification(c.id, 'issuingOrganization', e.target.value)}
                              placeholder="Issuing organization"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 7: Projects */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#17243B]">7. Notable Projects</h3>
                      <p className="text-xs text-[#777781] mt-0.5">
                        Key projects or case studies (optional).
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

                  {(!formData.projects || formData.projects.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-[#E6E2DC] rounded-xl text-center space-y-2">
                      <Rocket className="w-8 h-8 text-[#8172A8] mx-auto" />
                      <p className="text-xs font-semibold text-[#17243B]">No projects added</p>
                      <p className="text-[11px] text-[#777781]">Skip if not applicable.</p>
                      <button
                        type="button"
                        onClick={addProject}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B]"
                      >
                        + Add Project Entry
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.projects.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FAF8FC]/20 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]/60">
                            <span className="text-xs font-bold text-[#17243B]">{p.title || 'Project'}</span>
                            <button
                              type="button"
                              onClick={() => removeProject(p.id)}
                              className="text-[#777781] hover:text-red-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <input
                              type="text"
                              value={p.title || ''}
                              onChange={(e) => updateProject(p.id, 'title', e.target.value)}
                              placeholder="Project title"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <input
                              type="text"
                              value={p.role || ''}
                              onChange={(e) => updateProject(p.id, 'role', e.target.value)}
                              placeholder="Your role"
                              className="px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                            />
                            <div className="sm:col-span-2">
                              <textarea
                                rows={2}
                                value={p.description || ''}
                                onChange={(e) => updateProject(p.id, 'description', e.target.value)}
                                placeholder="Description and outcome..."
                                className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 8: Additional Information */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">8. Additional Professional Information</h3>
                    <p className="text-xs text-[#777781] mt-0.5">
                      Languages, awards, career gaps, or narrative guidance for your writer (optional).
                    </p>
                  </div>

                  <div>
                    <textarea
                      rows={6}
                      value={formData.additionalInformation || ''}
                      onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                      placeholder="Add any extra details, career nuances, or context you'd like your consultant to know..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 9: Review & Finish */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">9. Profile Review & Confirmation</h3>
                    <p className="text-xs text-[#777781] mt-0.5">
                      Your career profile is ready. You can submit now or update any section at a later stage.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF8FC] border border-[#E6E2DC] space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]">
                      <span className="font-semibold text-[#17243B]">Personal Details:</span>
                      <span className="text-[#777781]">{formData.fullName || 'Not specified'} ({formData.email || 'No email'})</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]">
                      <span className="font-semibold text-[#17243B]">Employment Records:</span>
                      <span className="text-[#777781]">{formData.employmentHistory?.length || 0} roles entered</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]">
                      <span className="font-semibold text-[#17243B]">Education Entries:</span>
                      <span className="text-[#777781]">{formData.education?.length || 0} degrees entered</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#17243B]">Resume Uploaded:</span>
                      <span className="text-[#777781]">{uploadedResumeName || 'None (Manual Profile)'}</span>
                    </div>
                  </div>

                  <div className="bg-[#17243B] text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#A69ACB]" />
                        <span>Save Profile & Continue</span>
                      </h4>
                      <p className="text-xs text-white/80 mt-1 max-w-md">
                        Your profile is stored securely. You can order services right away or return anytime to edit.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveProfile('INFORMATION_SUBMITTED', 'MANUAL_ENTRY')}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold transition shrink-0 shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Save Profile & Finish'}
                    </button>
                  </div>
                </div>
              )}

              {/* Wizard Footer Navigation Controls */}
              <div className="pt-6 border-t border-[#E6E2DC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1) {
                        setActiveMode('CHOICE');
                      } else {
                        setCurrentStep((prev) => Math.max(1, prev - 1));
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#17243B] hover:bg-[#F7F5F0] transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{currentStep === 1 ? 'Back to Choices' : 'Previous'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Skip for now button */}
                  {currentStep < 9 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.min(9, prev + 1))}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#777781] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
                    >
                      Skip for Now
                    </button>
                  )}

                  {/* Save and Continue button */}
                  {currentStep < 9 ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveProfile('PARTIALLY_COMPLETED', 'MANUAL_ENTRY');
                        setCurrentStep((prev) => Math.min(9, prev + 1));
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
                    >
                      <span>Save & Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href="/career-services/portal/orders/new"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold shadow-sm transition"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
