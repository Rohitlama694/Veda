"use client";

import React, { useState } from "react";
import { X, Calendar, Plus, AlertCircle } from "lucide-react";
import { addTaskToProject } from "@/lib/projectStore";

interface AddTaskModalProps {
  projectId: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  projectId,
  projectTitle,
  isOpen,
  onClose,
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [dueDate, setDueDate] = useState("2026-11-25");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }
    if (!expectedOutput.trim()) {
      setError("Expected output is required.");
      return;
    }

    setLoading(true);

    const result = addTaskToProject(projectId, {
      title: title.trim(),
      description: description.trim(),
      expectedOutput: expectedOutput.trim(),
      dueDate,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to add task.");
      return;
    }

    onTaskAdded();
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    setTitle("");
    setDescription("");
    setExpectedOutput("");
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
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Add Structured Task</h3>
                <p className="text-xs text-[#586B63]">
                  Append deliverable milestone to <span className="font-semibold text-slate-800">{projectTitle}</span>
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

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Task 5: Production Deployment & Observability"
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Task Description & Instructions <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What interns must accomplish for this milestone..."
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expected Deliverable Output <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="GitHub pull request, benchmark CSV, notebook, etc."
                required
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Submission Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#8EE2B7]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
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
                <Plus className="w-4 h-4" />
                <span>{loading ? "Adding..." : "Add Deliverable"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
