"use client";

import React from "react";
import { X, ExternalLink, GitBranch, Calendar, CheckCircle2, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import { SubmissionAttempt } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";

interface SubmissionDetailDrawerProps {
  submission: SubmissionAttempt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionDetailDrawer: React.FC<SubmissionDetailDrawerProps> = ({
  submission,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#FAF8F3] border-l border-[#EAE5DA] shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#EAE5DA]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A57C2A]">
                  Attempt #{submission.version}
                </span>
                <StatusBadge status={submission.status} />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="mt-3 text-xl font-bold text-[#182622]">{submission.taskTitle}</h2>
            <p className="text-xs text-[#52645D] mt-0.5">{submission.projectTitle}</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 grow">
            {/* Intern profile card */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE5DA] flex items-center gap-4">
              <UserAvatar name={submission.internName} role="INTERN" size="xl" />
              <div>
                <p className="text-xs font-medium text-slate-400">Intern</p>
                <p className="text-base font-bold text-[#182622]">{submission.internName}</p>
                <p className="text-xs text-slate-500">{submission.internEmail}</p>
              </div>
            </div>

            {/* Submission metadata */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE5DA] space-y-3">
              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" /> Submitted on
                </span>
                <span className="font-semibold text-slate-800">{submission.createdAt}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-500">
                  <GitBranch className="w-4 h-4 text-slate-400" /> Version
                </span>
                <span className="font-semibold text-slate-800">Version {submission.version}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <span className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" /> Assigned Mentor
                </span>
                <span className="font-semibold text-slate-800">{submission.mentorName}</span>
              </div>
            </div>

            {/* Repository URL */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE5DA]">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Repository Submission
              </p>
              <a
                href={submission.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-3 rounded-lg bg-[#F5F2EB] hover:bg-[#EAE5DA] text-[#0F2E22] font-medium text-sm transition-colors"
              >
                <span className="truncate max-w-[280px] font-mono text-xs text-emerald-900">
                  {submission.repositoryUrl}
                </span>
                <ExternalLink className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-800" />
              </a>
            </div>

            {/* Intern Note */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE5DA]">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Intern Note
              </p>
              <p className="text-sm text-[#273832] bg-[#FAF8F5] p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                &ldquo;{submission.note || "No submission note provided."}&rdquo;
              </p>
            </div>

            {/* Mentor Review History */}
            <div className="bg-white rounded-xl p-4 border border-[#EAE5DA]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Mentor Review Feedback
                </p>
                {submission.reviews.length > 0 && (
                  <span className="text-[11px] font-medium text-slate-400">
                    {submission.reviews.length} written review
                  </span>
                )}
              </div>

              {submission.reviews.length === 0 ? (
                <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/60 text-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-amber-900">Awaiting mentor review</p>
                  <p className="text-[11px] text-amber-700/80 mt-0.5">
                    {submission.mentorName} has been assigned to evaluate this submission attempt.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submission.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-lg bg-[#FAF8F5] border border-slate-200 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{rev.mentorName}</span>
                          <span className="text-[10px] text-slate-400">({rev.createdAt})</span>
                        </div>
                        <StatusBadge status={rev.decision} size="sm" />
                      </div>
                      <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-100">
                        {rev.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-[#EAE5DA] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <a
              href={submission.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#0F2E22] text-[#8EE2B7] hover:bg-[#0A2218] transition-colors flex items-center gap-1.5"
            >
              Open GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
