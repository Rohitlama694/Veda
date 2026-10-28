"use client";

import React, { useState, useEffect } from "react";
import { Users, GraduationCap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { KpiCard } from "../KpiCard";
import { DonutChart } from "../DonutChart";
import { GroupOverviewCard } from "../GroupOverviewCard";
import { SubmissionsTable } from "../SubmissionsTable";
import {
  MOCK_KPIS,
  MOCK_SUBMISSION_STATS,
  MOCK_GROUPS,
  MOCK_SUBMISSIONS,
} from "@/lib/mockData";
import { getStoredUsers, USER_UPDATE_EVENT } from "@/lib/userStore";

interface OverviewViewProps {
  onNavigateToSubmissions?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateToSubmissions }) => {
  const [totalUsers, setTotalUsers] = useState<number>(MOCK_KPIS.totalUsers);
  const [activeInterns, setActiveInterns] = useState<number>(MOCK_KPIS.activeInterns);

  useEffect(() => {
    const syncCounts = () => {
      const stored = getStoredUsers();
      setTotalUsers(stored.length);
      setActiveInterns(stored.filter((u) => u.role === "INTERN" && u.isActive).length);
    };
    syncCounts();

    window.addEventListener(USER_UPDATE_EVENT, syncCounts);
    return () => window.removeEventListener(USER_UPDATE_EVENT, syncCounts);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#B48535]">
          Welcome back, Administrator
        </h2>
        <p className="mt-1 text-sm text-[#586B63]">
          Monitor internship progress across your programme.
        </p>
      </div>

      {/* KPI Cards (4 in a row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <KpiCard
          title="Total Users"
          value={totalUsers}
          subtitle={`${totalUsers} active portal accounts`}
          subtitleColor="text-[#15803D]"
          icon={Users}
          iconBgClass="bg-[#E7F7EF]"
          iconColorClass="text-[#158054]"
        />

        <KpiCard
          title="Active Interns"
          value={activeInterns}
          subtitle={`${activeInterns} active cohort learners`}
          subtitleColor="text-slate-500"
          icon={GraduationCap}
          iconBgClass="bg-[#E5F5FA]"
          iconColorClass="text-[#0284C7]"
        />

        <KpiCard
          title="Pending Reviews"
          value={MOCK_KPIS.pendingReviews}
          subtitle={MOCK_KPIS.pendingLabel}
          subtitleColor="text-[#B45309]"
          icon={AlertTriangle}
          iconBgClass="bg-[#FEF5E7]"
          iconColorClass="text-[#D97706]"
        />

        <KpiCard
          title="Approved Attempts"
          value={MOCK_KPIS.approvedAttempts}
          subtitle={MOCK_KPIS.approvedTrend}
          subtitleColor="text-[#16A34A]"
          icon={CheckCircle2}
          iconBgClass="bg-[#EBF9F0]"
          iconColorClass="text-[#16A34A]"
        />
      </div>

      {/* Submission Progress & Group Overview (2 Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6 xl:col-span-6">
          <DonutChart stats={MOCK_SUBMISSION_STATS} />
        </div>

        <div className="lg:col-span-6 xl:col-span-6">
          <GroupOverviewCard groups={MOCK_GROUPS} />
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div>
        <SubmissionsTable
          submissions={MOCK_SUBMISSIONS}
          maxRows={3}
          showViewAllLink={true}
          onViewAll={onNavigateToSubmissions}
          title="Recent Submissions"
        />
      </div>
    </div>
  );
};
