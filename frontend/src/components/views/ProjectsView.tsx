"use client";

import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  Layers,
  ArrowRight,
  FolderPlus,
} from "lucide-react";
import {
  getStoredProjects,
  deleteTaskFromProject,
  PROJECT_UPDATE_EVENT,
} from "@/lib/projectStore";
import { Project, Task } from "@/lib/types";
import { AddProjectModal } from "../admin/AddProjectModal";
import { EditProjectModal } from "../admin/EditProjectModal";
import { AssignProjectModal } from "../admin/AssignProjectModal";
import { DeleteProjectModal } from "../admin/DeleteProjectModal";
import { AddTaskModal } from "../admin/AddTaskModal";

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modals state
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [assignProjectOpen, setAssignProjectOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const refreshProjects = () => {
    const list = getStoredProjects();
    setProjects(list);
    if (list.length > 0) {
      if (!list.some((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(list[0].id);
      }
    }
  };

  useEffect(() => {
    refreshProjects();

    const handleSync = () => {
      refreshProjects();
    };

    window.addEventListener(PROJECT_UPDATE_EVENT, handleSync);
    return () => {
      window.removeEventListener(PROJECT_UPDATE_EVENT, handleSync);
    };
  }, [selectedProjectId]);

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  const handleDeleteTask = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    if (!activeProject) return;
    if (window.confirm("Are you sure you want to delete this task deliverable?")) {
      const res = deleteTaskFromProject(activeProject.id, taskId);
      if (res.success) {
        showToast("Task deliverable removed.");
      } else {
        alert(res.error || "Cannot delete task.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0F2E22] text-[#8EE2B7] border border-[#1F4D3A] shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#8CE6B6] shrink-0" />
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#182622]">Projects & Tasks</h2>
          <p className="text-xs text-[#586B63] mt-0.5">
            Manage curriculum project milestones, task deliverables, acceptance criteria, and cohort assignments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAssignProjectOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#DED7C8] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#A57C2A]" />
            <span>Assign to Cohort / Mentor</span>
          </button>

          <button
            onClick={() => setAddProjectOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] text-xs font-bold hover:bg-[#0A2218] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2.5 border-b border-[#EAE5DA] pb-3 overflow-x-auto">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedProjectId === proj.id
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span className="font-mono text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              {proj.groupCode}
            </span>
            <span>{proj.title}</span>
          </button>
        ))}
      </div>

      {/* Active Project Card */}
      {activeProject && (
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-[#0F2E22] text-white text-xs font-bold px-2.5 py-1 rounded">
                {activeProject.groupCode}
              </span>
              <h3 className="text-xl font-bold text-[#182622]">{activeProject.title}</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {activeProject.tasksCount} Sequential Tasks
              </span>
            </div>

            {/* Project Edit & Delete Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditProjectOpen(true)}
                title="Edit project details and description"
                className="px-3 py-1.5 rounded-lg border border-[#DED7C8] text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Project</span>
              </button>

              <button
                onClick={() => setAssignProjectOpen(true)}
                title="Change cohort group or mentor assignment"
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/50 text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Reassign Group/Mentor</span>
              </button>

              <button
                onClick={() => setDeleteProjectOpen(true)}
                title="Delete this project from curriculum"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE5DA]">
              <p className="font-bold text-[#A57C2A] uppercase tracking-wider text-[10px] mb-1">
                Problem Statement
              </p>
              <p className="text-slate-700 leading-relaxed">{activeProject.problemStatement}</p>
            </div>
            <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE5DA]">
              <p className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] mb-1">
                Expected Final Output
              </p>
              <p className="text-slate-700 leading-relaxed">{activeProject.expectedFinalOutput}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {activeProject && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#182622]">Structured Task Deliverables</h3>
            <button
              onClick={() => setAddTaskOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-800" />
              <span>Add Deliverable Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProject.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="bg-white rounded-2xl border border-[#EAE5DA] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#A57C2A] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-mono">
                      Task #{task.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      {activeProject.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTask(e, task.id)}
                          title="Delete task"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="mt-3 text-base font-bold text-[#182622] group-hover:text-emerald-950">
                    {task.title}
                  </h4>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {task.totalSubmissions} {task.totalSubmissions === 1 ? "attempt" : "attempts"} logged
                  </span>
                  <span className="font-semibold text-emerald-800 group-hover:underline">
                    View Output Requirements →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSelectedTask(null)}
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xl z-10 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#A57C2A] uppercase">
                    Task #{selectedTask.number} Deliverable
                  </span>
                  <h3 className="text-base font-bold text-[#182622]">{selectedTask.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Detailed Description
                  </p>
                  <p className="mt-1 text-slate-600 leading-relaxed bg-[#FAF8F3] p-3 rounded-lg border border-slate-200">
                    {selectedTask.description}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Expected Output & Submission Format
                  </p>
                  <p className="mt-1 text-emerald-950 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
                    {selectedTask.expectedOutput}
                  </p>
                </div>

                <div className="flex justify-between items-center text-slate-600 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span>Target Submission Deadline:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedTask.dueDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={addProjectOpen}
        onClose={() => setAddProjectOpen(false)}
        onProjectAdded={(newProj) => {
          refreshProjects();
          setSelectedProjectId(newProj.id);
          showToast(`Project "${newProj.title}" has been added!`);
        }}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={activeProject}
        isOpen={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        onProjectUpdated={(updated) => {
          refreshProjects();
          showToast(`Project "${updated.title}" was updated.`);
        }}
      />

      {/* Assign Project Modal */}
      <AssignProjectModal
        initialProjectId={activeProject?.id}
        initialGroupId={activeProject?.groupId}
        isOpen={assignProjectOpen}
        onClose={() => setAssignProjectOpen(false)}
        onAssigned={() => {
          refreshProjects();
          showToast(`Project assignment updated successfully.`);
        }}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        project={activeProject}
        isOpen={deleteProjectOpen}
        onClose={() => setDeleteProjectOpen(false)}
        onProjectDeleted={(p) => {
          refreshProjects();
          showToast(`Project "${p.title}" was deleted.`);
        }}
      />

      {/* Add Task Modal */}
      {activeProject && (
        <AddTaskModal
          projectId={activeProject.id}
          projectTitle={activeProject.title}
          isOpen={addTaskOpen}
          onClose={() => setAddTaskOpen(false)}
          onTaskAdded={() => {
            refreshProjects();
            showToast(`Task added to "${activeProject.title}".`);
          }}
        />
      )}
    </div>
  );
};
