"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle, AlertCircle } from "lucide-react";
import { deleteProject } from "@/lib/projectStore";
import { Project } from "@/lib/types";

interface DeleteProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectDeleted: (project: Project) => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectDeleted,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !project) return null;

  const handleDelete = () => {
    setError(null);
    setLoading(true);

    const result = deleteProject(project.id);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to delete project.");
      return;
    }

    onProjectDeleted(project);
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
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-rose-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Project</h3>
                <p className="text-xs text-rose-600 font-medium">Irreversible curriculum action</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Preview */}
          <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#182622]">{project.title}</span>
              <span className="bg-[#0F2E22] text-[#8EE2B7] text-[10px] font-bold px-2 py-0.5 rounded">
                {project.groupCode}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{project.problemStatement}</p>
            <div className="pt-2 border-t border-[#F0ECE2] flex items-center justify-between text-xs text-slate-500">
              <span>Sequenced Tasks:</span>
              <span className="font-semibold text-slate-800">{project.tasksCount} Tasks</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-900">{project.title}</strong>?
            Any task milestones linked to this project will be removed from the curriculum timeline.
          </p>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-40 text-xs cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? "Deleting..." : "Delete Project"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
