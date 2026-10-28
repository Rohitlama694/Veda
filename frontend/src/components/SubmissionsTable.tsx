"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { SubmissionAttempt } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { SubmissionDetailDrawer } from "./SubmissionDetailDrawer";
import { UserAvatar } from "./UserAvatar";

interface SubmissionsTableProps {
  submissions: SubmissionAttempt[];
  showViewAllLink?: boolean;
  onViewAll?: () => void;
  title?: string;
  maxRows?: number;
  filterStatus?: string;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  showViewAllLink = true,
  onViewAll,
  title = "Recent Submissions",
  maxRows,
  filterStatus,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionAttempt | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Apply filters if needed
  let displayList = submissions;
  if (filterStatus && filterStatus !== "ALL") {
    displayList = displayList.filter((s) => s.status === filterStatus);
  }

  if (maxRows && maxRows > 0) {
    displayList = displayList.slice(0, maxRows);
  }

  const handleRowClick = (sub: SubmissionAttempt) => {
    setSelectedSubmission(sub);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0ECE2] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#182622]">{title}</h3>
          <span className="text-xs font-medium text-slate-400">
            Showing {displayList.length} {displayList.length === 1 ? "record" : "records"}
          </span>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#F0ECE2] text-xs font-semibold text-[#546760] bg-[#FAF8F3]">
                <th scope="col" className="px-6 py-3.5">
                  Intern
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Task
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Submitted Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Mentor
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE8]">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No submissions matching criteria.
                  </td>
                </tr>
              ) : (
                displayList.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => handleRowClick(sub)}
                    className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
                  >
                    {/* Intern */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={sub.internName} role="INTERN" size="md" />
                        <span className="font-semibold text-[#182622] group-hover:text-emerald-950">
                          {sub.internName}
                        </span>
                      </div>
                    </td>

                    {/* Task */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C3E37]">
                      {sub.taskTitle}
                    </td>

                    {/* Submitted Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {sub.createdAt}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>

                    {/* Mentor */}
                    <td className="px-6 py-4 whitespace-nowrap text-[#2C3E37]">
                      {sub.mentorName}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(sub);
                        }}
                        className="inline-flex items-center justify-center px-3.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900 transition-all shadow-2xs"
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

        {/* Footer */}
        {showViewAllLink && (
          <div className="px-6 py-4 bg-white border-t border-[#F0ECE2] flex justify-end">
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2E22] hover:text-emerald-800 transition-colors group cursor-pointer"
            >
              <span>View All Submissions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Drawer */}
      <SubmissionDetailDrawer
        submission={selectedSubmission}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};
