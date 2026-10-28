import React from "react";
import { SubmissionStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: SubmissionStatus | string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const normalized = status.toUpperCase();

  let bgClass = "bg-amber-50 text-amber-800 border-amber-200/80";
  let label = status;

  if (normalized === "APPROVED") {
    bgClass = "bg-[#E6F8EE] text-[#136C40] border-[#B7ECCF]";
    label = "Approved";
  } else if (normalized === "PENDING" || normalized === "IN_REVIEW") {
    bgClass = "bg-[#FEF7DC] text-[#8C6B0B] border-[#FBEA9D]";
    label = "Pending";
  } else if (normalized === "CORRECTIONS_REQUESTED" || normalized === "CORRECTIONS_PENDING") {
    bgClass = "bg-[#FFF0E6] text-[#A64215] border-[#FFD3BA]";
    label = "Corrections Requested";
  } else if (normalized === "ACTIVE") {
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    label = "Active";
  }

  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${paddingClass} ${bgClass}`}
    >
      {normalized === "CORRECTIONS_REQUESTED" ? (
        <span className="flex items-center gap-1">
          <span className="font-semibold text-orange-600">Corrections</span>
          <span className="text-orange-800">Requested</span>
        </span>
      ) : (
        label
      )}
    </span>
  );
};
