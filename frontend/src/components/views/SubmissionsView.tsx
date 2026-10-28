"use client";

import React, { useState } from "react";
import { Search, ExternalLink, GitBranch, MessageSquare, ArrowUpRight } from "lucide-react";
import { MOCK_SUBMISSIONS } from "@/lib/mockData";
import { SubmissionAttempt, SubmissionStatus } from "@/lib/types";
import { StatusBadge } from "../StatusBadge";
import { SubmissionDetailDrawer } from "../SubmissionDetailDrawer";
import { UserAvatar } from "../UserAvatar";

export const SubmissionsView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionAttempt | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = MOCK_SUBMISSIONS.filter((sub) => {
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    const matchesSearch =
      sub.internName.toLowerCase().includes(search.toLowerCase()) ||
      sub.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      sub.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      sub.repositoryUrl.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = [
    { id: "ALL", label: "All Submissions", count: MOCK_SUBMISSIONS.length },
    { id: "PENDING", label: "Pending", count: MOCK_SUBMISSIONS.filter((s) => s.status === "PENDING").length },
    { id: "CORRECTIONS_REQUESTED", label: "Corrections Requested", count: MOCK_SUBMISSIONS.filter((s) => s.status === "CORRECTIONS_REQUESTED").length },
    { id: "APPROVED", label: "Approved", count: MOCK_SUBMISSIONS.filter((s) => s.status === "APPROVED").length },
  ];

  const handleOpenDrawer = (sub: SubmissionAttempt) => {
    setSelectedSubmission(sub);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#182622]">All Submissions</h2>
          <p className="text-xs text-[#586B63] mt-0.5">
            Audit trail of GitHub repository submissions, attempts versioning, and mentor review feedback.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search intern, task, repo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl border border-[#DED7C8] pl-3.5 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === s.id
                ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
            }`}
          >
            <span>{s.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === s.id ? "bg-[#184635] text-[#8EE2B7]" : "bg-slate-100 text-slate-600"
              }`}
            >
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#F0ECE2] text-xs font-semibold text-[#546760] bg-[#FAF8F3]">
                <th scope="col" className="px-6 py-3.5">
                  Intern
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Task & Version
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Repository URL
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Submitted On
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Mentor Review
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE8]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No submission records matching the current filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => handleOpenDrawer(sub)}
                    className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
                  >
                    {/* Intern */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={sub.internName} role="INTERN" size="md" />
                        <div>
                          <p className="font-semibold text-[#182622] group-hover:text-emerald-950">
                            {sub.internName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{sub.internEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Task & Version */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#182622]">{sub.taskTitle}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                          v{sub.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{sub.projectTitle}</p>
                    </td>

                    {/* Repository URL */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={sub.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-mono text-xs text-emerald-800 hover:text-emerald-950 hover:underline"
                      >
                        <span className="truncate max-w-[160px]">
                          {sub.repositoryUrl.replace("https://github.com/", "")}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </a>
                    </td>

                    {/* Submitted Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {sub.createdAt}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>

                    {/* Mentor Review */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{sub.mentorName}</span>
                        {sub.reviews.length > 0 ? (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            Reviewed
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(sub);
                        }}
                        className="inline-flex items-center justify-center px-3.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
                      >
                        {sub.status === "PENDING" ? "Review" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 bg-[#FAF8F3] border-t border-[#F0ECE2] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resubmissions create new numbered attempts without overwriting history.</span>
          <span className="font-semibold text-slate-700">6 total attempts recorded across cohort</span>
        </div>
      </div>

      {/* Drawer */}
      <SubmissionDetailDrawer
        submission={selectedSubmission}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};
