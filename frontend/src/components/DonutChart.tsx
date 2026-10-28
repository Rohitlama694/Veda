"use client";

import React, { useState } from "react";
import { SubmissionOverviewStats } from "@/lib/types";

interface DonutChartProps {
  stats: SubmissionOverviewStats;
}

export const DonutChart: React.FC<DonutChartProps> = ({ stats }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const { approved, pending, correctionsRequested, total } = stats;

  // Calculate circumferences and stroke-dasharrays
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const approvedFraction = total > 0 ? approved / total : 0;
  const pendingFraction = total > 0 ? pending / total : 0;
  const correctionsFraction = total > 0 ? correctionsRequested / total : 0;

  const approvedDash = approvedFraction * circumference;
  const pendingDash = pendingFraction * circumference;
  const correctionsDash = correctionsFraction * circumference;

  // Offsets (starting from top, rotate -90deg)
  const approvedOffset = 0;
  const pendingOffset = -approvedDash;
  const correctionsOffset = -(approvedDash + pendingDash);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
      <h3 className="text-base font-bold text-[#182622]">Submission Progress</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F1EFEA"
              strokeWidth={strokeWidth}
            />

            {/* Approved segment (Green) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#2EB872"
              strokeWidth={strokeWidth}
              strokeDasharray={`${approvedDash} ${circumference - approvedDash}`}
              strokeDashoffset={approvedOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSegment("Approved")}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Corrections Requested segment (Teal / Coral) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#4ECDC4"
              strokeWidth={strokeWidth}
              strokeDasharray={`${correctionsDash} ${circumference - correctionsDash}`}
              strokeDashoffset={correctionsOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSegment("Corrections Requested")}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* Pending segment (Gold / Amber) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#EBB338"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pendingDash} ${circumference - pendingDash}`}
              strokeDashoffset={pendingOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSegment("Pending")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-[#162520]">
              {hoveredSegment === "Approved"
                ? approved
                : hoveredSegment === "Pending"
                ? pending
                : hoveredSegment === "Corrections Requested"
                ? correctionsRequested
                : total}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {hoveredSegment ? hoveredSegment.split(" ")[0].toLowerCase() : "attempts"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {/* Approved */}
          <div
            className={`flex items-center justify-between sm:justify-start gap-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
              hoveredSegment === "Approved" ? "bg-slate-50 font-semibold" : ""
            }`}
            onMouseEnter={() => setHoveredSegment("Approved")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#2EB872] shrink-0" />
              <span className="text-sm font-medium text-[#2C3E37]">Approved</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ml-auto sm:ml-4">
              {approved}
            </span>
          </div>

          {/* Pending */}
          <div
            className={`flex items-center justify-between sm:justify-start gap-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
              hoveredSegment === "Pending" ? "bg-slate-50 font-semibold" : ""
            }`}
            onMouseEnter={() => setHoveredSegment("Pending")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#EBB338] shrink-0" />
              <span className="text-sm font-medium text-[#2C3E37]">Pending</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ml-auto sm:ml-4">
              {pending}
            </span>
          </div>

          {/* Corrections Requested */}
          <div
            className={`flex items-center justify-between sm:justify-start gap-3 p-1.5 rounded-lg transition-colors cursor-pointer ${
              hoveredSegment === "Corrections Requested" ? "bg-slate-50 font-semibold" : ""
            }`}
            onMouseEnter={() => setHoveredSegment("Corrections Requested")}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#4ECDC4] shrink-0" />
              <span className="text-sm font-medium text-[#2C3E37]">Corrections Requested</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto sm:ml-4">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                {correctionsRequested}
              </span>
              <div className="hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4ECDC4]/70" />
                <span className="w-2 h-2 rounded-full bg-[#F38181]/80" />
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
