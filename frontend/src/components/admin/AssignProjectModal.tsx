"use client";

import React, { useState, useEffect } from "react";
import { X, Layers, UsersRound, FolderKanban, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { assignProjectToGroup, getStoredProjects, getStoredGroups } from "@/lib/projectStore";
import { getStoredUsers } from "@/lib/userStore";
import { Group, Project } from "@/lib/types";
import { UserAvatar } from "../UserAvatar";

interface AssignProjectModalProps {
  initialProjectId?: number;
  initialGroupId?: number;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export const AssignProjectModal: React.FC<AssignProjectModalProps> = ({
  initialProjectId,
  initialGroupId,
  isOpen,
  onClose,
  onAssigned,
}) => {
  const projects = getStoredProjects();
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();
  const mentors = allUsers.filter((u) => u.role === "MENTOR");

  const [selectedProjectId, setSelectedProjectId] = useState<number>(
    initialProjectId || projects[0]?.id || 1
  );
  const [selectedGroupId, setSelectedGroupId] = useState<number>(
    initialGroupId || groups[0]?.id || 1
  );
  const [selectedMentorId, setSelectedMentorId] = useState<number>(mentors[0]?.id || 2);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialProjectId) setSelectedProjectId(initialProjectId);
    if (initialGroupId) {
      setSelectedGroupId(initialGroupId);
      const grp = groups.find((g) => g.id === initialGroupId);
      if (grp) setSelectedMentorId(grp.mentorId);
    }
  }, [initialProjectId, initialGroupId, isOpen]);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId);
  const currentGroup = groups.find((g) => g.id === selectedGroupId);
  const currentMentor = mentors.find((m) => m.id === selectedMentorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = assignProjectToGroup(
      Number(selectedProjectId),
      Number(selectedGroupId),
      Number(selectedMentorId)
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to assign project.");
      return;
    }

    onAssigned();
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
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] text-[#A57C2A] flex items-center justify-center border border-[#E9E3D3]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Assign Project to Group & Mentor</h3>
                <p className="text-xs text-[#586B63]">Link curriculum projects with cohorts and supervising mentors</p>
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

            {/* Select Project */}
            <div>
              <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[11px] mb-1">
                Select Project:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.tasksCount} Tasks)
                  </option>
                ))}
              </select>
              {currentProject && (
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {currentProject.problemStatement}
                </p>
              )}
            </div>

            {/* Select Group */}
            <div>
              <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[11px] mb-1">
                Assign to Cohort Group:
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  const gId = Number(e.target.value);
                  setSelectedGroupId(gId);
                  const grp = groups.find((g) => g.id === gId);
                  if (grp) setSelectedMentorId(grp.mentorId);
                }}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.code} — {g.name} ({g.interns.length} Active Interns)
                  </option>
                ))}
              </select>
            </div>

            {/* Select Mentor */}
            <div>
              <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[11px] mb-1">
                Assign Supervising Mentor:
              </label>
              <select
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              >
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Summary Box */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-2">
              <p className="text-[10px] font-bold text-[#A57C2A] uppercase tracking-wider">
                Assignment Configuration Summary
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-800">
                <span className="font-semibold text-slate-900">{currentProject?.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#EAE5DA] text-[#0F2E22] font-bold">
                  {currentGroup?.code}
                </span>
              </div>
              {currentMentor && (
                <div className="flex items-center gap-2 pt-1 border-t border-[#F0ECE2] text-xs">
                  <UserAvatar name={currentMentor.fullName} role="MENTOR" size="xs" />
                  <span className="text-slate-600">
                    Lead Mentor: <strong>{currentMentor.fullName}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
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
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? "Assigning..." : "Confirm Assignment"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
