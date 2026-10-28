"use client";

import React, { useState } from "react";
import { X, FolderPlus, FolderKanban, UsersRound, Calendar, AlertCircle, Plus, Trash2 } from "lucide-react";
import { addProject, getStoredGroups } from "@/lib/projectStore";
import { getStoredUsers } from "@/lib/userStore";
import { Project } from "@/lib/types";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
}) => {
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();
  const mentors = allUsers.filter((u) => u.role === "MENTOR");

  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [expectedFinalOutput, setExpectedFinalOutput] = useState("");
  const [groupId, setGroupId] = useState<number>(groups[0]?.id || 1);
  const [mentorId, setMentorId] = useState<number>(mentors[0]?.id || 2);

  // Initial task
  const [taskTitle, setTaskTitle] = useState("Task 1: Initial Technical Specification");
  const [taskDescription, setTaskDescription] = useState(
    "Set up repository structure, install dependencies, and document baseline solution design."
  );
  const [taskExpectedOutput, setTaskExpectedOutput] = useState(
    "GitHub repository with architecture documentation and initial working prototype."
  );
  const [taskDueDate, setTaskDueDate] = useState("2026-11-15");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

    const result = addProject({
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      expectedFinalOutput: expectedFinalOutput.trim(),
      groupId: Number(groupId),
      mentorId: Number(mentorId),
      tasks: [
        {
          title: taskTitle.trim() || "Task 1: Initial Milestone",
          description: taskDescription.trim(),
          expectedOutput: taskExpectedOutput.trim(),
          dueDate: taskDueDate,
        },
      ],
    });

    setLoading(false);

    if (!result.success || !result.project) {
      setError(result.error || "Failed to create project.");
      return;
    }

    onProjectAdded(result.project);
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    setTitle("");
    setProblemStatement("");
    setExpectedFinalOutput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F8EE] text-[#136C40] flex items-center justify-center border border-[#B7ECCF]">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Add New Curriculum Project</h3>
                <p className="text-xs text-[#586B63]">
                  Define project specifications and assign to cohort group & mentor
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Project Title */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Vector Retrieval System"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
            </div>

            {/* Assignment: Group & Mentor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA]">
              <div>
                <label className="block font-bold text-[#0F2E22] uppercase tracking-wider text-[10px] mb-1">
                  Assign to Cohort Group <span className="text-rose-500">*</span>
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
                  Assign Supervising Mentor <span className="text-rose-500">*</span>
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
                placeholder="Detailed technical problem statement and context..."
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
                rows={2}
                value={expectedFinalOutput}
                onChange={(e) => setExpectedFinalOutput(e.target.value)}
                placeholder="Deliverable specifications, benchmark requirements, GitHub repository expectation..."
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* Initial Task Card */}
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Initial Milestone Deliverable
                </span>
                <span className="text-[10px] text-slate-400">Task #1</span>
              </div>

              <div>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Task description & instructions"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={taskExpectedOutput}
                  onChange={(e) => setTaskExpectedOutput(e.target.value)}
                  placeholder="Expected output summary"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px] whitespace-nowrap">Due:</span>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{loading ? "Creating..." : "Create Project"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
