import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = "text-slate-500",
  icon: Icon,
  iconBgClass,
  iconColorClass,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#4A5D55]">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-[#162520] mt-1.5">{value}</p>
          <p className={`text-xs font-medium mt-1.5 ${subtitleColor}`}>{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>
    </div>
  );
};
