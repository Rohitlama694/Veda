"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  KeyRound,
  Trash2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { User, UserRole } from "@/lib/types";
import {
  getStoredUsers,
  deletePortalUser,
  resetPortalUsers,
  USER_UPDATE_EVENT,
} from "@/lib/userStore";
import { RoleBadge } from "../RoleBadge";
import { UserAvatar } from "../UserAvatar";
import { AddUserModal } from "../admin/AddUserModal";
import { EditUserModal } from "../admin/EditUserModal";
import { ChangeUserPasswordModal } from "../admin/ChangeUserPasswordModal";
import { DeleteUserModal } from "../admin/DeleteUserModal";

interface UsersViewProps {
  initialSearch?: string;
}

export const UsersView: React.FC<UsersViewProps> = ({ initialSearch = "" }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [search, setSearch] = useState(initialSearch);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToChangePassword, setUserToChangePassword] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info">("success");

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync users with userStore
  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    setIsClient(true);
    refreshUsers();

    const handleSync = () => {
      refreshUsers();
    };

    window.addEventListener(USER_UPDATE_EVENT, handleSync);
    return () => {
      window.removeEventListener(USER_UPDATE_EVENT, handleSync);
    };
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(search.toLowerCase())) ||
      (user.assignedGroupCode && user.assignedGroupCode.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const roles = [
    { id: "ALL", label: "All Users", count: users.length },
    {
      id: "ADMIN",
      label: "Administrator",
      count: users.filter((u) => u.role === "ADMIN").length,
    },
    {
      id: "MENTOR",
      label: "Mentors",
      count: users.filter((u) => u.role === "MENTOR").length,
    },
    {
      id: "INTERN",
      label: "Interns",
      count: users.filter((u) => u.role === "INTERN").length,
    },
  ];

  const handleResetSeed = () => {
    if (window.confirm("Reset all user accounts back to original demo seed dataset?")) {
      const defaultUsers = resetPortalUsers();
      setUsers(defaultUsers);
      setSelectedUser(null);
      showToast("Reset all portal users to default seed dataset.", "info");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0F2E22] text-[#8CE6B6] border border-[#1F4D3A] shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#8CE6B6] shrink-0" />
          <span className="text-xs font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#182622]">User Management</h2>
          <p className="text-xs text-[#586B63] mt-0.5">
            Create, manage, and configure portal user credentials, emails, passwords, and cohort memberships.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative grow md:w-64">
            <input
              type="text"
              placeholder="Search by name, email, track..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl border border-[#DED7C8] pl-3.5 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8EE2B7] focus:border-transparent transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          {/* Add User Primary Button */}
          <button
            onClick={() => setAddUserOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] text-xs font-bold hover:bg-[#0A2218] transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                roleFilter === r.id
                  ? "bg-[#0F2E22] text-[#8EE2B7] shadow-xs"
                  : "bg-white text-slate-600 border border-[#EAE5DA] hover:bg-slate-50"
              }`}
            >
              <span>{r.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  roleFilter === r.id
                    ? "bg-[#184635] text-[#8EE2B7]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {r.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleResetSeed}
          title="Reset back to default demo users"
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100/60 transition-colors whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Seed Data</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#F0ECE2] text-xs font-semibold text-[#546760] bg-[#FAF8F3]">
                <th scope="col" className="px-5 py-3.5">
                  User
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Email
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Assigned Group
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Joined
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE8]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No users found matching &ldquo;{search}&rdquo; in this role filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isRootAdmin = user.id === 1 || user.email === "admin@veda.internal";
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
                    >
                      {/* User Column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.fullName} role={user.role} size="lg" />
                          <div>
                            <p className="font-bold text-[#182622] group-hover:text-emerald-950 flex items-center gap-1.5">
                              {user.fullName}
                              {isRootAdmin && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                                  Root
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400">{user.department}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email Column */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-700 font-mono">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Assigned Group */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-700">
                        {user.assignedGroupCode ? (
                          <span className="inline-block px-2.5 py-0.5 rounded bg-[#FAF6EE] text-[#0F2E22] font-semibold border border-[#E9E3D3]">
                            {user.assignedGroupCode}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-right text-xs text-slate-500">
                        {user.joinedDate}
                      </td>

                      {/* Actions Column */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div
                          className="inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Change Email & Details */}
                          <button
                            type="button"
                            onClick={() => setUserToEdit(user)}
                            title="Edit user details & change email"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F2E22] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Change Password */}
                          <button
                            type="button"
                            onClick={() => setUserToChangePassword(user)}
                            title="Change user password"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            disabled={isRootAdmin}
                            onClick={() => setUserToDelete(user)}
                            title={isRootAdmin ? "Root admin cannot be deleted" : "Delete user"}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isRootAdmin
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-[#FAF8F3] border-t border-[#F0ECE2] text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Showing {filteredUsers.length} of {users.length} registered portal users.
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Target schema: Django `accounts.User`
          </span>
        </div>
      </div>

      {/* User Detail View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSelectedUser(null)}
            />
            <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xl z-10 text-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <UserAvatar name={selectedUser.fullName} role={selectedUser.role} size="xl" />
                <div className="grow">
                  <h3 className="text-base font-bold text-[#182622]">{selectedUser.fullName}</h3>
                  <p className="text-slate-600 font-mono text-[11px]">{selectedUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <RoleBadge role={selectedUser.role} size="sm" />
                    {selectedUser.id === 1 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Primary Root Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Department / Track</span>
                  <span className="font-semibold text-slate-800">{selectedUser.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Cohort Group</span>
                  <span className="font-semibold text-slate-800">
                    {selectedUser.assignedGroupCode || "None (Administrative oversight)"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Account Status</span>
                  <span
                    className={`font-semibold ${
                      selectedUser.isActive ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {selectedUser.isActive ? "Active (Authentication enabled)" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Registered Date</span>
                  <span className="font-semibold text-slate-800">{selectedUser.joinedDate}</span>
                </div>
              </div>

              {/* Quick Actions in Detail Modal */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUser;
                      setSelectedUser(null);
                      setUserToEdit(u);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#DED7C8] text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Change Email / Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedUser;
                      setSelectedUser(null);
                      setUserToChangePassword(u);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/50 text-amber-800 font-medium hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change Password</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {selectedUser.id !== 1 && selectedUser.email !== "admin@veda.internal" && (
                    <button
                      type="button"
                      onClick={() => {
                        const u = selectedUser;
                        setSelectedUser(null);
                        setUserToDelete(u);
                      }}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-1.5 rounded-xl bg-[#0F2E22] text-[#8EE2B7] font-semibold hover:bg-[#0A2218] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onUserAdded={(userName) => {
          refreshUsers();
          showToast(`User "${userName}" has been successfully created!`);
        }}
      />

      {/* Edit User & Change Email Modal */}
      <EditUserModal
        user={userToEdit}
        isOpen={Boolean(userToEdit)}
        onClose={() => setUserToEdit(null)}
        onUserUpdated={(updated) => {
          refreshUsers();
          showToast(`Account details for "${updated.fullName}" were updated.`);
        }}
      />

      {/* Change Password Modal */}
      <ChangeUserPasswordModal
        user={userToChangePassword}
        isOpen={Boolean(userToChangePassword)}
        onClose={() => setUserToChangePassword(null)}
        onPasswordChanged={(u) => {
          refreshUsers();
          showToast(`Password for "${u.fullName}" was successfully updated.`);
        }}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        user={userToDelete}
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onUserDeleted={(u) => {
          refreshUsers();
          showToast(`User account "${u.fullName}" was removed.`);
        }}
      />
    </div>
  );
};
