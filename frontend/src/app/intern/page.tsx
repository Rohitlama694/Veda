"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenCheck,
  Calendar,
  ExternalLink,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  LogOut,
  UserCheck,
  FolderKanban,
  X,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { RoleBadge } from "@/components/RoleBadge";
import { MOCK_PROJECT_1 } from "@/lib/mockData";
import { getCurrentSession, logoutSession } from "@/lib/authStore";
import { User } from "@/lib/types";

export default function InternPortalPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "INTERN") {
      if (session.role === "ADMIN") router.replace("/admin");
      else if (session.role === "MENTOR") router.replace("/mentor");
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

  // Current intern metadata
  const intern = {
    id: currentUser?.id || 4,
    fullName: currentUser?.fullName || "Aarav Mehta",
    email: currentUser?.email || "aarav.mehta@veda.internal",
    groupCode: currentUser?.assignedGroupCode || "VEDA-01",
    projectName: "Baseline ML Project",
    mentorName: "Dr. Anish Sharma",
    mentorEmail: "anish.sharma@veda.internal",
  };

  // State for task submissions
  const [tasks, setTasks] = useState([
    {
      id: 101,
      number: 1,
      title: "Task 1: EDA & Repository Setup",
      description: "Initialize project repository with poetry/pip-tools, linters, and conduct exploratory data analysis.",
      expectedOutput: "GitHub repository link with formatted EDA Jupyter notebooks.",
      dueDate: "Oct 25, 2026",
      status: "APPROVED",
      version: 1,
      repoUrl: "https://github.com/veda-interns/aarav-ml-baseline",
      note: "Initial EDA committed with correlation matrices and null imputation notebook.",
      mentorFeedback: "Excellent documentation, thorough feature distribution analysis, and very clean git commit hygiene. Approved to proceed with Task 2.",
      reviewDate: "Oct 25, 2026 16:45",
    },
    {
      id: 102,
      number: 2,
      title: "Task 2: Data Preparation & Modeling",
      description: "Build feature transformation pipelines and train baseline classification models (LightGBM, Random Forest).",
      expectedOutput: "Clean scikit-learn pipeline scripts and cross-validation performance report.",
      dueDate: "Nov 02, 2026",
      status: "CORRECTIONS_REQUESTED",
      version: 1,
      repoUrl: "https://github.com/veda-interns/aarav-ml-modeling",
      note: "Submitted baseline Random Forest model code. Evaluation accuracy achieves 84.2% on holdout split.",
      mentorFeedback: "Data leakage detected: standard scaling was applied across the whole dataset before train/test split. Please wrap preprocessing in a strict sklearn Pipeline and submit version 2.",
      reviewDate: "Oct 24, 2026 19:10",
    },
    {
      id: 103,
      number: 3,
      title: "Task 3: Hyperparameter Tuning & Metrics",
      description: "Optimize hyperparameters using Optuna and log experiment artifacts using MLflow/Weights & Biases.",
      expectedOutput: "Automated sweep configuration and model comparison dashboard export.",
      dueDate: "Nov 10, 2026",
      status: "UPCOMING",
      version: 0,
      repoUrl: "",
      note: "",
      mentorFeedback: "",
      reviewDate: "",
    },
    {
      id: 104,
      number: 4,
      title: "Task 4: Packaging & Containerization",
      description: "Package inference endpoints using FastAPI, containerize with Docker, and write automated integration tests.",
      expectedOutput: "Dockerfile, pytest test suite passing at >80% coverage, and documentation.",
      dueDate: "Nov 18, 2026",
      status: "UPCOMING",
      version: 0,
      repoUrl: "",
      note: "",
      mentorFeedback: "",
      reviewDate: "",
    },
  ]);

  // Modal state
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[0] | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [repoInput, setRepoInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOpenSubmit = (task: (typeof tasks)[0]) => {
    setSelectedTask(task);
    setRepoInput(task.repoUrl || "https://github.com/veda-interns/aarav-ml-submission");
    setNoteInput("");
    setSubmitSuccess(false);
    setSubmissionModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    // Increment version, set status to PENDING
    const newVersion = (selectedTask.version || 0) + 1;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              status: "PENDING",
              version: newVersion,
              repoUrl: repoInput,
              note: noteInput,
            }
          : t
      )
    );

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmissionModalOpen(false);
      setSubmitSuccess(false);
    }, 1200);
  };

  const approvedCount = tasks.filter((t) => t.status === "APPROVED").length;
  const progressPercent = Math.round((approvedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 md:px-10 border-b border-[#ECE7DC]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#E2BD62]">VEDA</span>
              <span className="text-[10px] font-bold tracking-widest text-[#0F2E22] uppercase bg-[#8CE6B6] px-2 py-0.5 rounded">
                INTERN
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
              <span className="bg-[#0F2E22] text-[#8EE2B7] font-bold px-2 py-0.5 rounded text-[11px]">
                {intern.groupCode}
              </span>
              <span className="font-semibold text-slate-800">{intern.projectName}</span>
            </div>
          </div>

          {/* Right: Mentor info & Intern profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-[#FAF8F3] border border-[#EAE5DA] px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400">Mentor:</span>
              <span className="font-bold text-[#182622]">{intern.mentorName}</span>
            </div>

            {/* Intern profile pill */}
            <div className="flex items-center gap-2.5">
              <UserAvatar name={intern.fullName} role="INTERN" size="md" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#182622] leading-tight">{intern.fullName}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Intern</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Sign out of intern account"
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
        {/* Welcome & Progress Banner */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A57C2A]">
                Intern Workspace • Cohort {intern.groupCode}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-[#182622] mt-0.5">
                Welcome back, {intern.fullName}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Assigned Project: <strong>{intern.projectName}</strong> supervised by{" "}
                <strong>{intern.mentorName}</strong>.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-[#FAF8F3] p-3 rounded-xl border border-[#EAE5DA] shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Milestone Progress
                </span>
                <span className="text-lg font-bold text-[#0F2E22]">
                  {approvedCount} of {tasks.length} Approved
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#0F2E22] flex items-center justify-center font-bold text-xs text-[#0F2E22]">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#EAE6DF] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0F2E22] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Callout if Corrections Requested */}
        {tasks.some((t) => t.status === "CORRECTIONS_REQUESTED") && (
          <div className="p-4 rounded-2xl bg-[#FFF6EF] border border-[#FED7AA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#9A3412]">
                  Action Required: Mentor Requested Corrections
                </p>
                <p className="text-xs text-orange-800/90 mt-0.5 leading-relaxed">
                  {intern.mentorName} left written feedback on Task 2: &ldquo;
                  {tasks.find((t) => t.status === "CORRECTIONS_REQUESTED")?.mentorFeedback}&rdquo;
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const t = tasks.find((item) => item.status === "CORRECTIONS_REQUESTED");
                if (t) handleOpenSubmit(t);
              }}
              className="px-4 py-2 rounded-xl bg-[#9A3412] text-white text-xs font-semibold hover:bg-orange-800 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Submit Version 2 →
            </button>
          </div>
        )}

        {/* Task Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#182622]">Assigned Curriculum Tasks</h2>
            <span className="text-xs text-slate-400">
              Submit your work via GitHub repository URLs for mentor evaluation.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#A57C2A] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Task #{task.number}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-[#182622]">{task.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-[#FAF8F3] border border-slate-200 text-xs space-y-1.5">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Expected Deliverable
                    </p>
                    <p className="text-slate-600">{task.expectedOutput}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 pt-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target Due Date: {task.dueDate}</span>
                    </div>
                  </div>

                  {/* Mentor Feedback Box if any */}
                  {task.mentorFeedback && (
                    <div className="mt-3 p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-900 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Mentor Feedback ({task.reviewDate})
                        </span>
                      </div>
                      <p className="text-orange-950 leading-relaxed">{task.mentorFeedback}</p>
                    </div>
                  )}

                  {/* Submission note if pending */}
                  {task.status === "PENDING" && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                      <p className="font-semibold text-amber-900">Attempt v{task.version} under review</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Awaiting review from {intern.mentorName}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {task.repoUrl ? (
                    <a
                      href={task.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 hover:underline"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Attempt v{task.version}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No attempt submitted yet</span>
                  )}

                  <button
                    onClick={() => handleOpenSubmit(task)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      task.status === "CORRECTIONS_REQUESTED"
                        ? "bg-[#9A3412] text-white hover:bg-orange-800 shadow-xs"
                        : task.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-[#0F2E22] text-[#8EE2B7] hover:bg-[#0A2218] shadow-xs"
                    }`}
                  >
                    {task.status === "CORRECTIONS_REQUESTED"
                      ? "Submit v2 (Fix Corrections)"
                      : task.status === "APPROVED"
                      ? "View Submission (v" + task.version + ")"
                      : task.version > 0
                      ? "Resubmit New Attempt"
                      : "Submit Task"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="px-6 py-6 border-t border-[#ECE7DC] text-center text-xs text-slate-500 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>VEDA Intern Workspace • Resubmissions create versioned records without overwriting history</span>
        <button
          onClick={handleSignOut}
          className="text-slate-500 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out & Switch Account</span>
        </button>
      </footer>

      {/* Submission Modal */}
      {submissionModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSubmissionModalOpen(false)}
            />

            <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xl z-10 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#A57C2A] uppercase">
                    Task #{selectedTask.number} • Attempt #{(selectedTask.version || 0) + 1}
                  </span>
                  <h3 className="text-base font-bold text-[#182622]">{selectedTask.title}</h3>
                </div>
                <button
                  onClick={() => setSubmissionModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-base font-bold text-[#182622]">Task Submitted Successfully!</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Attempt #{(selectedTask.version || 0) + 1} has been routed to{" "}
                    <strong>{intern.mentorName}</strong> for review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmSubmit} className="py-4 space-y-4">
                  {/* Warning on resubmission */}
                  {selectedTask.status === "CORRECTIONS_REQUESTED" && (
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs">
                      <p className="font-bold">Addressing Mentor Corrections:</p>
                      <p className="mt-1 italic">&ldquo;{selectedTask.mentorFeedback}&rdquo;</p>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      GitHub Repository URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      placeholder="https://github.com/veda-interns/your-repo"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent font-mono shadow-2xs"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Must be a valid, public GitHub repository link.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Submission Notes / Commit Summary
                    </label>
                    <textarea
                      rows={3}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Describe what you built, pipeline changes, or test metrics..."
                      className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent shadow-2xs"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Creates Version #{(selectedTask.version || 0) + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSubmissionModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-bold text-xs hover:bg-[#0A2218] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Attempt</span>
                      </button>
                    </div>
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
