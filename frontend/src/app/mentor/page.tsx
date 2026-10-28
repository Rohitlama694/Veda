"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  GitBranch,
  MessageSquare,
  Send,
  LogOut,
  FolderKanban,
  FileCheck,
  X,
  Search,
  Calendar,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { RoleBadge } from "@/components/RoleBadge";
import { getCurrentSession, logoutSession } from "@/lib/authStore";
import { User } from "@/lib/types";

export default function MentorPortalPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "MENTOR") {
      if (session.role === "ADMIN") router.replace("/admin");
      else if (session.role === "INTERN") router.replace("/intern");
      else router.replace("/login");
      return;
    }
    setCurrentUser(session);
    setAuthorized(true);
  }, [router]);

  const handleSignOut = () => {
    logoutSession();
    router.replace("/login");
  };

  // Current logged in mentor metadata
  const mentor = {
    id: currentUser?.id || 2,
    fullName: currentUser?.fullName || "Dr. Anish Sharma",
    email: currentUser?.email || "anish.sharma@veda.internal",
    role: "MENTOR" as const,
    groupCode: currentUser?.assignedGroupCode || "VEDA-01",
    groupName: "Baseline ML Project",
    department: currentUser?.department || "Machine Learning & AI",
  };

  // Submissions under Dr. Anish Sharma's review
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      internName: "Aarav Mehta",
      internEmail: "aarav.mehta@veda.internal",
      taskNumber: 1,
      taskTitle: "Task 1: EDA & Repository Setup",
      version: 1,
      repoUrl: "https://github.com/veda-interns/aarav-ml-baseline",
      note: "Initial EDA committed with correlation matrices, feature distributions, and null imputation strategy notebook. Ready for mentor review.",
      submittedAt: "Oct 26, 2026",
      status: "PENDING" as const,
      feedback: "",
      reviewedAt: "",
    },
    {
      id: 2,
      internName: "Priya Nair",
      internEmail: "priya.nair@veda.internal",
      taskNumber: 1,
      taskTitle: "Task 1: EDA & Repository Setup",
      version: 1,
      repoUrl: "https://github.com/veda-interns/priya-eda-analysis",
      note: "Comprehensive exploratory analysis with seaborn visualizations, statistical skewness tests, and automated data profiling reports.",
      submittedAt: "Oct 25, 2026",
      status: "APPROVED" as const,
      feedback:
        "Excellent documentation, thorough feature distribution analysis, and very clean git commit hygiene. Approved to proceed with Task 2 modeling.",
      reviewedAt: "Oct 25, 2026 16:45",
    },
    {
      id: 3,
      internName: "Aarav Mehta",
      internEmail: "aarav.mehta@veda.internal",
      taskNumber: 2,
      taskTitle: "Task 2: Data Preparation & Modeling",
      version: 1,
      repoUrl: "https://github.com/veda-interns/aarav-ml-modeling",
      note: "Submitted baseline Random Forest model code. Evaluation accuracy achieves 84.2% on holdout split.",
      submittedAt: "Oct 24, 2026",
      status: "CORRECTIONS_REQUESTED" as const,
      feedback:
        "Data leakage detected: standard scaling was applied across the whole dataset before train/test split. Please wrap preprocessing in a strict sklearn Pipeline and submit version 2.",
      reviewedAt: "Oct 24, 2026 19:10",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"pending" | "all" | "approved" | "corrections">("pending");
  const [selectedSub, setSelectedSub] = useState<(typeof submissions)[0] | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Review Form State
  const [decision, setDecision] = useState<"APPROVED" | "CORRECTIONS_REQUESTED">("APPROVED");
  const [feedbackText, setFeedbackText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleOpenReview = (sub: (typeof submissions)[0]) => {
    setSelectedSub(sub);
    setDecision(sub.status === "CORRECTIONS_REQUESTED" ? "CORRECTIONS_REQUESTED" : "APPROVED");
    setFeedbackText(sub.feedback || "");
    setFormError(null);
    setReviewSuccess(false);
    setReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Rule: Corrections requests REQUIRE written feedback
    if (decision === "CORRECTIONS_REQUESTED" && !feedbackText.trim()) {
      setFormError("Written review feedback is mandatory when requesting corrections.");
      return;
    }

    if (!selectedSub) return;

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSub.id
          ? {
              ...s,
              status: decision,
              feedback: feedbackText,
              reviewedAt: "Just now",
            }
          : s
      )
    );

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setReviewSuccess(false);
    }, 1000);
  };

  // Filter list
  const filteredList = submissions.filter((s) => {
    if (activeTab === "pending") return s.status === "PENDING";
    if (activeTab === "approved") return s.status === "APPROVED";
    if (activeTab === "corrections") return s.status === "CORRECTIONS_REQUESTED";
    return true;
  });

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 md:px-10 border-b border-[#ECE7DC]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#E2BD62]">VEDA</span>
              <span className="text-[10px] font-bold tracking-widest text-[#0F2E22] uppercase bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                MENTOR
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
              <span className="bg-[#0F2E22] text-[#8EE2B7] font-bold px-2 py-0.5 rounded text-[11px]">
                {mentor.groupCode}
              </span>
              <span className="font-semibold text-slate-800">{mentor.groupName}</span>
            </div>
          </div>

          {/* Right: Mentor profile & quick role switches */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <UserAvatar name={mentor.fullName} role="MENTOR" size="md" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#182622] leading-tight">{mentor.fullName}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Supervising Mentor</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Sign out of mentor account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-6 py-8 md:px-10 space-y-6">
        {/* Mentor Overview Banner */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA]">
                Mentor Review Portal • {mentor.department}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#182622] mt-0.5">
                Welcome back, {mentor.fullName}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Supervising cohort <strong>{mentor.groupCode}</strong>: Aarav Mehta & Priya Nair.
              </p>
            </div>

            {/* Pending count pill */}
            <div className="flex items-center gap-3 bg-[#FAF8F3] p-3 rounded-xl border border-[#EAE5DA] shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Pending Review
                </span>
                <span className="text-lg font-bold text-amber-700">
                  {pendingCount} {pendingCount === 1 ? "Attempt" : "Attempts"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "pending"
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span>Pending Reviews</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "pending" ? "bg-[#184635] text-[#8EE2B7]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "all"
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span>All Submissions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "approved"
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span>Approved</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {submissions.filter((s) => s.status === "APPROVED").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("corrections")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "corrections"
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span>Corrections Requested</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {submissions.filter((s) => s.status === "CORRECTIONS_REQUESTED").length}
            </span>
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-12 text-center text-slate-400 text-xs">
              No submissions currently in this filter.
            </div>
          ) : (
            filteredList.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={sub.internName} role="INTERN" size="lg" />
                    <div>
                      <p className="font-bold text-[#182622]">{sub.internName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{sub.internEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Submitted: {sub.submittedAt}</span>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#A57C2A] uppercase">
                        Deliverable Attempt
                      </span>
                      <h3 className="text-base font-bold text-[#182622]">
                        {sub.taskTitle} <span className="text-slate-400 font-mono text-xs">(v{sub.version})</span>
                      </h3>
                    </div>

                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono text-emerald-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>Inspect Repository</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>

                  <div>
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Intern Submission Note
                    </p>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic leading-relaxed">
                      &ldquo;{sub.note || "No note provided."}&rdquo;
                    </p>
                  </div>

                  {sub.feedback && (
                    <div>
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                        Your Mentor Review Feedback ({sub.reviewedAt})
                      </p>
                      <p className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        {sub.feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleOpenReview(sub)}
                    className="px-5 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-bold text-xs hover:bg-[#0A2218] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{sub.status === "PENDING" ? "Review Submission" : "Update Review"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Global Footer */}
      <footer className="px-6 py-6 border-t border-[#ECE7DC] text-center text-xs text-slate-500 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>VEDA Mentor Workspace • Written feedback enforced for all corrections requests</span>
        <button
          onClick={handleSignOut}
          className="text-slate-500 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out & Switch Account</span>
        </button>
      </footer>

      {/* Review Modal */}
      {reviewModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setReviewModalOpen(false)}
            />

            <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xl z-10 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#4338CA] uppercase">
                    Mentor Evaluation • Attempt v{selectedSub.version}
                  </span>
                  <h3 className="text-base font-bold text-[#182622]">
                    Reviewing: {selectedSub.internName}
                  </h3>
                </div>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-[#182622]">Review Saved & Logged</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Decision recorded as <strong>{decision}</strong>. Intern will receive review notification.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveReview} className="py-4 space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                      {formError}
                    </div>
                  )}

                  {/* Task details summary */}
                  <div className="p-3 rounded-xl bg-[#FAF8F3] border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-800">{selectedSub.taskTitle}</p>
                    <a
                      href={selectedSub.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-800 hover:underline"
                    >
                      {selectedSub.repoUrl} <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  {/* Decision selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">Review Decision *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDecision("APPROVED")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          decision === "APPROVED"
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Attempt</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">
                          Accept work and unlock subsequent milestone task.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDecision("CORRECTIONS_REQUESTED")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          decision === "CORRECTIONS_REQUESTED"
                            ? "bg-orange-50 border-orange-400 text-orange-950 font-bold ring-2 ring-orange-300"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-orange-700">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Request Corrections</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">
                          Requires written feedback. Intern must submit next version.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Written feedback textarea */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Written Feedback {decision === "CORRECTIONS_REQUESTED" ? "*" : "(Optional)"}
                    </label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={
                        decision === "CORRECTIONS_REQUESTED"
                          ? "Explain specifically what needs correction (e.g. data leakage, missing tests, code styling)..."
                          : "Provide constructive commendations or guidance for the next task..."
                      }
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent shadow-2xs"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Enforced rule: Corrections requests require written feedback.
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-bold text-xs hover:bg-[#0A2218] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review Decision</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
