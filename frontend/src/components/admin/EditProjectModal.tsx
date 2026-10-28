"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, FolderKanban, Save, AlertCircle } from "lucide-react";
import { updateProject, getStoredGroups } from "@/lib/projectStore";
import { getStoredUsers } from "@/lib/userStore";
import { Project } from "@/lib/types";

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}) => {
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();
  const mentors = allUsers.filter((u) => u.role === "MENTOR");

  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [expectedFinalOutput, setExpectedFinalOutput] = useState("");
  const [groupId, setGroupId] = useState<number>(1);
  const [mentorId, setMentorId] = useState<number>(2);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setProblemStatement(project.problemStatement);
      setExpectedFinalOutput(project.expectedFinalOutput);
      setGroupId(project.groupId || 1);

      // Find current mentor for this group
      const grp = groups.find((g) => g.id === project.groupId);
      if (grp) {
        setMentorId(grp.mentorId);
      }
      setError(null);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!problemStatement.trim()) {
      setError("Problem statement is required.");
      return;
    }
    if (!expectedFinalOutput.trim()) {
      setError("Expected final output is required.");
      return;
    }

    setLoading(true);

    const result = updateProject(project.id, {
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      expectedFinalOutput: expectedFinalOutput.trim(),
      groupId: Number(groupId),
      mentorId: Number(mentorId),
    });

    setLoading(false);

    if (!result.success || !result.project) {
      setError(result.error || "Failed to update project.");
      return;
    }

    onProjectUpdated(result.project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Edit Project Details</h3>
                <p className="text-xs text-[#586B63]">
                  Modify specifications and update group / mentor assignments
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
            </div>

            {/* Assignment: Group & Mentor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA]">
              <div>
                <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[10px] mb-1">
                  Assigned Cohort Group
                </label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} — {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[10px] mb-1">
                  Supervising Mentor
                </label>
                <select
                  value={mentorId}
                  onChange={(e) => setMentorId(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Problem Statement <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* Expected Final Output */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expected Final Output <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={expectedFinalOutput}
                onChange={(e) => setExpectedFinalOutput(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Project Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
