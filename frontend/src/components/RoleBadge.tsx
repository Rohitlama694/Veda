import React from "react";
import { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md";
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = "md" }) => {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let label = role as string;

  switch (role) {
    case "ADMIN":
      badgeStyle = "bg-[#0F2E22] text-[#8EE2B7] border-[#1C503D]";
      label = "Administrator";
      break;
    case "MENTOR":
      badgeStyle = "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]";
      label = "Mentor";
      break;
    case "INTERN":
      badgeStyle = "bg-[#E6F8EE] text-[#136C40] border-[#B7ECCF]";
      label = "Intern";
      break;
  }

  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${paddingClass} ${badgeStyle}`}>
      {label}
    </span>
  );
};
