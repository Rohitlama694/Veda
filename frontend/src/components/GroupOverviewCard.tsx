"use client";

import React, { useState } from "react";
import { Group } from "@/lib/types";
import { UserAvatar } from "./UserAvatar";

interface GroupOverviewCardProps {
  groups: Group[];
}

export const GroupOverviewCard: React.FC<GroupOverviewCardProps> = ({ groups }) => {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const currentGroup = groups[selectedGroupIndex] || groups[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#182622]">Group Overview</h3>
        {groups.length > 1 && (
          <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-lg">
            {groups.map((g, idx) => (
              <button
                key={g.code}
                onClick={() => setSelectedGroupIndex(idx)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded transition-all ${
                  selectedGroupIndex === idx
                    ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {g.code}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="my-auto py-2">
        {/* Group Code & Project Title */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-block bg-[#0F2E22] text-white text-xs font-semibold px-2.5 py-1 rounded tracking-wide">
            {currentGroup.code}
          </span>
          <span className="text-lg font-bold text-[#192723]">
            {currentGroup.project?.title || currentGroup.name}
          </span>
        </div>

        {/* Assigned Mentor */}
        <div className="mt-4 flex items-center gap-2 text-sm text-[#465851]">
          <span>Assigned Mentor:</span>
          <span className="font-semibold text-[#182622]">{currentGroup.mentor.fullName}</span>
        </div>

        {/* Interns with overlapping avatars */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-[#465851]">{currentGroup.interns.length} Interns:</span>
          <div className="flex items-center -space-x-2">
            {currentGroup.interns.map((intern) => (
              <UserAvatar
                key={intern.id}
                name={intern.fullName}
                role="INTERN"
                size="sm"
                className="ring-2 ring-white shadow-xs"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-[#293A33]">
            {currentGroup.interns.map((i) => i.fullName).join(", ")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pt-2">
        <div className="flex items-center gap-4">
          <div className="grow bg-[#EAE6DF] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0F2E22] h-full rounded-full transition-all duration-500"
              style={{ width: `${currentGroup.progressPercentage}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#182622] tabular-nums shrink-0">
            {currentGroup.progressPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
