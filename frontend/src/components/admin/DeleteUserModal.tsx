"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle, AlertCircle } from "lucide-react";
import { User } from "@/lib/types";
import { deletePortalUser } from "@/lib/userStore";
import { UserAvatar } from "../UserAvatar";
import { RoleBadge } from "../RoleBadge";

interface DeleteUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: (user: User) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserDeleted,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const isRootAdmin = user.id === 1 || user.email === "admin@veda.internal";

  const handleDelete = () => {
    if (isRootAdmin) {
      setError("The primary system administrator account cannot be deleted.");
      return;
    }

    setLoading(true);
    const result = deletePortalUser(user.id);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to delete user.");
      return;
    }

    onUserDeleted(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-rose-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
                <p className="text-xs text-rose-600 font-medium">Irreversible administrative action</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Preview */}
          <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE5DA] space-y-2">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.fullName} role={user.role} size="lg" />
              <div>
                <h4 className="font-bold text-sm text-[#182622]">{user.fullName}</h4>
                <p className="text-xs text-slate-500 font-mono">{user.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0ECE2] flex items-center justify-between text-xs">
              <span className="text-slate-500">Role:</span>
              <RoleBadge role={user.role} size="sm" />
            </div>
            {user.assignedGroupCode && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cohort Group:</span>
                <span className="font-semibold text-slate-700">{user.assignedGroupCode}</span>
              </div>
            )}
          </div>

          {/* Warning Message */}
          {isRootAdmin ? (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Protected Root Administrator</p>
                <p className="mt-0.5 text-[11px] text-amber-700">
                  This account serves as the default system administrator and cannot be removed to prevent portal lockout.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{user.fullName}</strong>?
              This will permanently remove their credentials and revoke access to portal task submissions, reviews, and cohort groups.
            </p>
          )}

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading || isRootAdmin}
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-40 text-xs cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? "Deleting..." : "Delete User"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
