"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OverviewView } from "@/components/views/OverviewView";
import { UsersView } from "@/components/views/UsersView";
import { GroupsView } from "@/components/views/GroupsView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { SubmissionsView } from "@/components/views/SubmissionsView";
import { SettingsView } from "@/components/views/SettingsView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { ApiStatusModal } from "@/components/ApiStatusModal";
import { SignOutModal } from "@/components/SignOutModal";
import { getCurrentSession, logoutSession } from "@/lib/authStore";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "ADMIN") {
      if (session.role === "MENTOR") router.replace("/mentor");
      else if (session.role === "INTERN") router.replace("/intern");
      else router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  // Initial tab from URL query param if present, default to 'overview'
  const initialTab = (searchParams.get("tab") as NavTab) || "overview";
  const [currentTab, setCurrentTab] = useState<NavTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  // Sync tab change
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.history.pushState(null, "", `/admin?tab=${tab}`);
  };

  const handleSignOutConfirm = () => {
    setSignOutModalOpen(false);
    logoutSession();
    router.push("/login");
  };

  // Determine page title & breadcrumbs based on tab
  const tabTitles: Record<NavTab, { title: string; breadcrumb: string }> = {
    overview: {
      title: "Administrator Overview",
      breadcrumb: "Workspace / Overview",
    },
    users: {
      title: "User Management",
      breadcrumb: "Workspace / Users",
    },
    groups: {
      title: "Groups & Mentors",
      breadcrumb: "Workspace / Groups & Mentors",
    },
    projects: {
      title: "Projects & Tasks",
      breadcrumb: "Workspace / Projects & Tasks",
    },
    submissions: {
      title: "Submissions & Reviews",
      breadcrumb: "Workspace / Submissions",
    },
    settings: {
      title: "Administrator Settings",
      breadcrumb: "Workspace / Settings",
    },
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.overview;

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onSignOut={() => setSignOutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="grow lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          pageTitle={currentMeta.title}
          breadcrumb={currentMeta.breadcrumb}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenPasswordModal={() => setPasswordModalOpen(true)}
          onOpenApiModal={() => setApiModalOpen(true)}
          onSignOut={() => setSignOutModalOpen(true)}
        />

        {/* Page Body */}
        <main className="grow px-6 py-8 md:px-10 max-w-7xl w-full mx-auto">
          {currentTab === "overview" && (
            <OverviewView onNavigateToSubmissions={() => handleSelectTab("submissions")} />
          )}
          {currentTab === "users" && <UsersView initialSearch={globalSearch} />}
          {currentTab === "groups" && <GroupsView />}
          {currentTab === "projects" && <ProjectsView />}
          {currentTab === "submissions" && <SubmissionsView />}
          {currentTab === "settings" && <SettingsView />}
        </main>

        {/* Global Footer */}
        <footer className="px-6 py-6 md:px-10 border-t border-[#ECE7DC] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F2E22]">VEDA</span>
            <span className="text-slate-400">•</span>
            <span>Internship Task Submission & Mentor Review Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setApiModalOpen(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              DRF API Spec
            </button>
            <span className="text-slate-300">•</span>
            <span>Role-Enforced Dashboard</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      <ApiStatusModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />

      <SignOutModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleSignOutConfirm}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
          <div className="text-sm font-semibold text-[#0F2E22] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8CE6B6] animate-ping" />
            Loading Administrator Workspace...
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
