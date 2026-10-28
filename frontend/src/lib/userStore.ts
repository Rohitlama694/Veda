import { User, UserRole } from "./types";
import { MOCK_USERS } from "./mockData";

export const STORAGE_KEY = "veda_portal_users_v1";
export const USER_UPDATE_EVENT = "veda:users-updated";

/**
 * Retrieve current users from browser localStorage or default mock seed
 */
export function getStoredUsers(): User[] {
  if (typeof window === "undefined") {
    return MOCK_USERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
      return MOCK_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
}

/**
 * Save users to localStorage and trigger sync event
 */
export function saveStoredUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(USER_UPDATE_EVENT, { detail: users }));
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
  }
}

/**
 * Add a new user with validation
 */
export function addPortalUser(data: {
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  assignedGroupCode?: string;
  password?: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const trimmedEmail = data.email.trim().toLowerCase();
  const trimmedName = data.fullName.trim();

  if (!trimmedName) {
    return { success: false, error: "Full name is required." };
  }
  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    return { success: false, error: "A valid email address is required." };
  }
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: `A user with email "${trimmedEmail}" already exists.` };
  }

  const nameParts = trimmedName.split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
  const now = new Date();
  const joinedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const newUser: User = {
    id: maxId + 1,
    email: trimmedEmail,
    firstName,
    lastName,
    fullName: trimmedName,
    role: data.role,
    isActive: true,
    department:
      data.department?.trim() ||
      (data.role === "ADMIN" ? "Internship Operations" : "Applied AI Track"),
    joinedDate,
    assignedGroupCode: data.assignedGroupCode?.trim() || undefined,
    password: data.password || "Veda@2026",
  };

  const updatedList = [...users, newUser];
  saveStoredUsers(updatedList);
  return { success: true, user: newUser };
}

/**
 * Update an existing user (including email, name, role, department, group)
 */
export function updatePortalUser(
  id: number,
  updates: {
    fullName?: string;
    email?: string;
    role?: UserRole;
    department?: string;
    assignedGroupCode?: string;
    isActive?: boolean;
  }
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return { success: false, error: "User not found." };
  }

  const current = users[index];
  let newEmail = current.email;

  if (updates.email !== undefined) {
    const trimmed = updates.email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      return { success: false, error: "A valid email address is required." };
    }
    const duplicate = users.some((u) => u.id !== id && u.email.toLowerCase() === trimmed);
    if (duplicate) {
      return { success: false, error: `Email "${trimmed}" is already assigned to another user.` };
    }
    newEmail = trimmed;
  }

  let newFullName = current.fullName;
  let newFirstName = current.firstName;
  let newLastName = current.lastName;
  if (updates.fullName !== undefined) {
    newFullName = updates.fullName.trim();
    if (!newFullName) {
      return { success: false, error: "Full name cannot be empty." };
    }
    const parts = newFullName.split(/\s+/);
    newFirstName = parts[0];
    newLastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  }

  const updatedUser: User = {
    ...current,
    email: newEmail,
    fullName: newFullName,
    firstName: newFirstName,
    lastName: newLastName,
    role: updates.role !== undefined ? updates.role : current.role,
    department: updates.department !== undefined ? updates.department : current.department,
    assignedGroupCode:
      updates.assignedGroupCode !== undefined
        ? updates.assignedGroupCode || undefined
        : current.assignedGroupCode,
    isActive: updates.isActive !== undefined ? updates.isActive : current.isActive,
  };

  const updatedList = [...users];
  updatedList[index] = updatedUser;
  saveStoredUsers(updatedList);
  return { success: true, user: updatedUser };
}

/**
 * Change / reset a user's password as Admin
 */
export function changePortalUserPassword(
  userId: number,
  newPassword: string
): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return { success: false, error: "User not found." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const updatedList = [...users];
  updatedList[index] = {
    ...updatedList[index],
    password: newPassword,
  };

  saveStoredUsers(updatedList);
  return { success: true };
}

/**
 * Delete a user (protects root admin)
 */
export function deletePortalUser(userId: number): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: "User not found." };
  }

  if (user.id === 1 || user.email === "admin@veda.internal") {
    return {
      success: false,
      error: "The primary root administrator account cannot be deleted.",
    };
  }

  const updatedList = users.filter((u) => u.id !== userId);
  saveStoredUsers(updatedList);
  return { success: true };
}

/**
 * Reset users to initial mock seed
 */
export function resetPortalUsers(): User[] {
  saveStoredUsers(MOCK_USERS);
  return MOCK_USERS;
}
