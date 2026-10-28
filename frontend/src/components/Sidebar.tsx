"use client";

import React from "react";
import {
  Home,
  Users,
  UsersRound,
  Folder,
  BookOpenCheck,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { MOCK_ADMIN_USER } from "@/lib/mockData";
import { UserAvatar } from "./UserAvatar";

export type NavTab = "overview" | "users" | "groups" | "projects" | "submissions" | "settings";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  onSignOut,
}) => {
  const navItems = [
    {
      id: "overview" as NavTab,
      label: "Overview",
      icon: Home,
    },
    {
      id: "users" as NavTab,
      label: "Users",
      icon: Users,
    },
    {
      id: "groups" as NavTab,
      label: "Groups & Mentors",
      icon: UsersRound,
    },
    {
      id: "projects" as NavTab,
      label: "Projects & Tasks",
      icon: Folder,
    },
    {
      id: "submissions" as NavTab,
      label: "Submissions",
      icon: BookOpenCheck,
    },
    {
      id: "settings" as NavTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0F2E22] text-[#95B5A7] select-none">
      {/* Brand & Logo */}
      <div>
        <div className="pt-8 pb-8 px-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-black tracking-tight text-[#E2BD62]">
                VEDA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#8CE6B6] -mt-3 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#84A997] uppercase mt-1">
              Internship Portal
            </p>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#95B5A7] hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="px-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer relative group text-left ${
                  isActive
                    ? "bg-[#8CE6B6] text-[#0F2E22] font-semibold shadow-sm"
                    : "text-[#A2BEB2] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-105 shrink-0 ${
                    isActive ? "text-[#0F2E22]" : "text-[#A2BEB2] group-hover:text-white"
                  }`}
                />
                <span className="truncate">{item.label}</span>

                {/* Subtle right accent pill on active state */}
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-l-md bg-[#DFB75A]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Administrator Profile */}
      <div className="p-4 m-3 rounded-2xl bg-[#092218]/60 border border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar name={MOCK_ADMIN_USER.fullName} role="ADMIN" size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{MOCK_ADMIN_USER.fullName}</p>
              <button
                onClick={onSignOut}
                className="text-[11px] text-[#84A997] hover:text-[#8CE6B6] transition-colors truncate block text-left"
              >
                or sign-out
              </button>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="p-1.5 rounded-lg text-[#95B5A7] hover:text-[#8CE6B6] hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen border-r border-[#0A2218] fixed top-0 bottom-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
