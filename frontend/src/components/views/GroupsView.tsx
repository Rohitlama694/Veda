"use client";

import React, { useState, useEffect } from "react";
import {
  UsersRound,
  FolderKanban,
  CheckCircle2,
  Clock,
  ChevronRight,
  FolderPlus,
  Layers,
  Pencil,
  UserCheck,
  Sparkles,
} from "lucide-react";
import {
  getStoredGroups,
  PROJECT_UPDATE_EVENT,
} from "@/lib/projectStore";
import { Group, Project } from "@/lib/types";
import { UserAvatar } from "../UserAvatar";
import { AddProjectModal } from "../admin/AddProjectModal";
import { EditProjectModal } from "../admin/EditProjectModal";
import { AssignProjectModal } from "../admin/AssignProjectModal";
import { ReassignMentorModal } from "../admin/ReassignMentorModal";

export const GroupsView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Modals state
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectTarget, setEditProjectTarget] = useState<Project | null>(null);
  const [assignProjectGroup, setAssignProjectGroup] = useState<Group | null>(null);
  const [reassignMentorGroup, setReassignMentorGroup] = useState<Group | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const refreshGroups = () => {
    const list = getStoredGroups();
    setGroups(list);
    if (selectedGroup) {
      const found = list.find((g) => g.id === selectedGroup.id);
      if (found) setSelectedGroup(found);
    }
  };

  useEffect(() => {
    refreshGroups();

    const handleSync = () => {
      refreshGroups();
    };

    window.addEventListener(PROJECT_UPDATE_EVENT, handleSync);
    return () => {
      window.removeEventListener(PROJECT_UPDATE_EVENT, handleSync);
    };
  }, []);

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
          <h2 className="text-2xl font-bold tracking-tight text-[#182622]">Groups & Mentors</h2>
          <p className="text-xs text-[#586B63] mt-0.5">
            Intern cohort clusters, assigned supervising mentors, and active project track mappings.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAssignProjectGroup(groups[0] || null)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#DED7C8] text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#A57C2A]" />
            <span>Assign Project to Group</span>
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

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              {/* Header Badge, Code & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#0F2E22] text-[#8EE2B7] text-xs font-bold px-3 py-1 rounded-lg tracking-wider">
                    {group.code}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {group.interns.length} Active Interns
                  </span>
                </div>

                {/* Cohort Quick Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAssignProjectGroup(group)}
                    title="Change or assign curriculum project"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-800 hover:bg-amber-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline text-[11px]">Assign Project</span>
                  </button>
                </div>
              </div>

              {/* Group Name & Project Title */}
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Assigned Project Track
                  </span>
                  <h3 className="text-xl font-bold text-[#182622]">{group.project?.title || group.name}</h3>
                </div>

                {group.project && (
                  <button
                    onClick={() => setEditProjectTarget(group.project)}
                    title="Edit project details"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 mt-2"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {group.project?.problemStatement}
              </p>

              {/* Mentor Card */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar name={group.mentor.fullName} role="MENTOR" size="lg" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A57C2A]">
                      Assigned Mentor
                    </span>
                    <p className="text-sm font-bold text-[#182622]">{group.mentor.fullName}</p>
                    <p className="text-[11px] text-slate-500">{group.mentor.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReassignMentorGroup(group)}
                  title="Reassign supervising mentor"
                  className="px-2.5 py-1 rounded-lg border border-[#DED7C8] bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3 h-3 text-[#136C40]" />
                  <span>Reassign</span>
                </button>
              </div>

              {/* Interns List */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">Intern Roster:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.interns.map((intern) => (
                    <div
                      key={intern.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      <UserAvatar name={intern.fullName} role="INTERN" size="xs" />
                      <span className="font-semibold text-slate-800 truncate">{intern.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Progress */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Cohort Deliverables Completed</span>
                <span className="font-bold text-[#0F2E22]">{group.progressPercentage}%</span>
              </div>
              <div className="w-full bg-[#EAE6DF] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0F2E22] h-full rounded-full transition-all duration-500"
                  style={{ width: `${group.progressPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>{group.project?.tasksCount || 0} Structured Tasks</span>
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 cursor-pointer"
                >
                  View Group Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSelectedGroup(null)}
            />
            <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xl z-10 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0F2E22] text-[#8EE2B7] font-bold px-2.5 py-0.5 rounded text-xs">
                    {selectedGroup.code}
                  </span>
                  <h3 className="text-base font-bold text-[#182622]">{selectedGroup.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Project Title & Problem Statement
                    </p>
                    <span className="font-semibold text-slate-900">{selectedGroup.project?.title}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-[#FAF8F3] p-3 rounded-lg border border-slate-200">
                    {selectedGroup.project?.problemStatement}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Expected Final Output
                  </p>
                  <p className="text-slate-600 leading-relaxed bg-[#FAF8F3] p-3 rounded-lg border border-slate-200">
                    {selectedGroup.project?.expectedFinalOutput}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                    Supervising Mentor & Intern Members
                  </p>
                  <div className="p-3 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-800">
                        <strong>Mentor:</strong> {selectedGroup.mentor.fullName} ({selectedGroup.mentor.email})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const grp = selectedGroup;
                          setSelectedGroup(null);
                          setReassignMentorGroup(grp);
                        }}
                        className="text-[11px] font-semibold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Change Mentor
                      </button>
                    </div>
                    <p className="text-slate-800 pt-1 border-t border-slate-100">
                      <strong>Interns:</strong>{" "}
                      {selectedGroup.interns.map((i) => `${i.fullName} (${i.email})`).join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const grp = selectedGroup;
                    setSelectedGroup(null);
                    setAssignProjectGroup(grp);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 font-semibold hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Assign Different Project</span>
                </button>

                <button
                  onClick={() => setSelectedGroup(null)}
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
          refreshGroups();
          showToast(`Project "${newProj.title}" created and assigned to group!`);
        }}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={editProjectTarget}
        isOpen={Boolean(editProjectTarget)}
        onClose={() => setEditProjectTarget(null)}
        onProjectUpdated={(p) => {
          refreshGroups();
          showToast(`Project "${p.title}" was updated.`);
        }}
      />

      {/* Assign Project to Group Modal */}
      <AssignProjectModal
        initialGroupId={assignProjectGroup?.id}
        initialProjectId={assignProjectGroup?.project?.id}
        isOpen={Boolean(assignProjectGroup)}
        onClose={() => setAssignProjectGroup(null)}
        onAssigned={() => {
          refreshGroups();
          showToast("Project assigned to cohort group & mentor!");
        }}
      />

      {/* Reassign Mentor Modal */}
      <ReassignMentorModal
        group={reassignMentorGroup}
        isOpen={Boolean(reassignMentorGroup)}
        onClose={() => setReassignMentorGroup(null)}
        onMentorReassigned={() => {
          refreshGroups();
          showToast("Supervising mentor successfully updated!");
        }}
      />
    </div>
  );
};
