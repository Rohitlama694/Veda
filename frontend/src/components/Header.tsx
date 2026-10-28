"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  CheckCircle,
  KeyRound,
  LogOut,
  ShieldCheck,
  Server,
  X,
  ExternalLink,
} from "lucide-react";
import { MOCK_ADMIN_USER, MOCK_NOTIFICATIONS } from "@/lib/mockData";
import { UserAvatar } from "./UserAvatar";

interface HeaderProps {
  pageTitle?: string;
  breadcrumb?: string;
  onOpenMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenPasswordModal?: () => void;
  onOpenApiModal?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle = "Administrator Overview",
  breadcrumb = "Workspace / Overview",
  onOpenMobileMenu,
  searchQuery = "",
  onSearchChange,
  onOpenPasswordModal,
  onOpenApiModal,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F6F0]/90 backdrop-blur-md px-6 py-4 md:px-10 border-b border-[#ECE7DC]">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Mobile menu toggle + Page title */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:block">
              {breadcrumb}
            </p>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#162520]">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right side: Search, Notifications, Admin Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search Input */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white rounded-full border border-[#DED7C8] pl-4 pr-10 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all shadow-2xs"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white border border-[#DED7C8] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#EAE5DA] shadow-xl py-3 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#182622]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.2 rounded-full text-[10px] font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-[#FAF9F5] transition-colors flex gap-3 ${
                        !n.read ? "bg-[#F7FAF8]" : ""
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === "approved" ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        ) : n.type === "submission" ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                            sub
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                            !
                          </div>
                        )}
                      </div>
                      <div className="grow">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400">All internship system events logged</span>
                </div>
              </div>
            )}
          </div>

          {/* Administrator Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/80 transition-all cursor-pointer group text-left"
              aria-label="Admin account menu"
            >
              <UserAvatar name={MOCK_ADMIN_USER.fullName} role="ADMIN" size="lg" />
              <div className="hidden md:block pr-1">
                <p className="text-xs font-bold text-[#182622] group-hover:text-emerald-900 leading-tight">
                  {MOCK_ADMIN_USER.fullName}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">Role: Super Admin</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#EAE5DA] shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Administrator Session</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{MOCK_ADMIN_USER.fullName}</p>
                  <p className="text-slate-500 text-[11px] truncate">{MOCK_ADMIN_USER.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenApiModal?.();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer"
                  >
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span>Django API Status</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenPasswordModal?.();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>Change Password</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut?.();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2.5 text-rose-700 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
