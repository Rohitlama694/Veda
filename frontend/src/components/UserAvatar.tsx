import React from "react";
import { UserRole } from "@/lib/types";

interface UserAvatarProps {
  name: string;
  role?: UserRole;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role,
  size = "md",
  className = "",
}) => {
  // Extract clean 2-letter initials, ignoring titles like "Dr."
  const cleanName = name.replace(/^Dr\.\s+/i, "").trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = "";
  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1) {
    initials = parts[0].slice(0, 2).toUpperCase();
  } else {
    initials = "U";
  }

  // Size classes
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px] font-bold",
    sm: "w-7 h-7 text-[11px] font-bold",
    md: "w-8 h-8 text-xs font-bold",
    lg: "w-9 h-9 text-xs font-bold",
    xl: "w-12 h-12 text-sm font-bold",
  }[size];

  // Palette by role
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
  if (role === "ADMIN") {
    colorClass = "bg-[#0F2E22] text-[#8EE2B7] border-[#1C503D]";
  } else if (role === "MENTOR") {
    colorClass = "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]";
  } else if (role === "INTERN") {
    colorClass = "bg-[#E6F8EE] text-[#136C40] border-[#B7ECCF]";
  } else {
    // Dynamic deterministic tint based on name hash
    const tints = [
      "bg-[#EBF7EE] text-[#158054] border-[#B7ECCF]",
      "bg-[#E5F5FA] text-[#0284C7] border-[#BAE6FD]",
      "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
      "bg-[#FEF6E7] text-[#B45309] border-[#FDE68A]",
      "bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash + name.charCodeAt(i)) % tints.length;
    }
    colorClass = tints[hash];
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 select-none border transition-transform ${sizeClasses} ${colorClass} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
    </div>
  );
};
