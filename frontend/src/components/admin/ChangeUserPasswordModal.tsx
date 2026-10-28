"use client";

import React, { useState } from "react";
import { X, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { User } from "@/lib/types";
import { changePortalUserPassword } from "@/lib/userStore";
import { UserAvatar } from "../UserAvatar";

interface ChangeUserPasswordModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: (user: User) => void;
}

export const ChangeUserPasswordModal: React.FC<ChangeUserPasswordModalProps> = ({
  user,
  isOpen,
  onClose,
  onPasswordChanged,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "Veda!";
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
    setConfirmPassword(pwd);
    setShowPassword(true);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    const result = changePortalUserPassword(user.id, newPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to update password.");
      return;
    }

    onPasswordChanged(user);
    handleClose();
  };

  const handleClose = () => {
    setError(null);
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-[#EAE5DA]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#182622]">Change User Password</h3>
                <p className="text-xs text-[#586B63]">Set new credentials for user authentication</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Target Banner */}
          <div className="mt-4 p-3 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.fullName} role={user.role} size="md" />
              <div>
                <p className="font-bold text-xs text-[#182622]">{user.fullName}</p>
                <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#EAE5DA] text-slate-700 uppercase">
              {user.role}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Password Generator Button */}
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700">New Password</label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Auto-generate secure key</span>
              </button>
            </div>

            {/* New Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                required
                className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter the new password"
                  required
                  className="w-full rounded-xl border border-slate-300 pl-3.5 pr-9 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={forceChangeNextLogin}
                  onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F2E22] focus:ring-[#8EE2B7]"
                />
                <span className="text-slate-700 font-medium text-[11px]">
                  Require user to update password upon their next login
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F0ECE2] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
