import { User, UserRole } from "./types";
import { getStoredUsers } from "./userStore";

export const AUTH_STORAGE_KEY = "veda_session_auth_v1";
export const AUTH_CHANGED_EVENT = "veda:auth-changed";

/**
 * Retrieve the currently authenticated session user
 */
export function getCurrentSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    if (user && user.id && user.role) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Authenticate session with user email
 */
export function loginSession(
  email: string,
  _password?: string
): { success: boolean; user?: User; error?: string } {
  const trimmed = email.trim().toLowerCase();
  const allUsers = getStoredUsers();
  const user = allUsers.find((u) => u.email.toLowerCase() === trimmed);

  if (!user) {
    return {
      success: false,
      error: `Account with email "${email}" was not found. Please verify your credentials or select a seeded role.`,
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      error: "This user account is currently deactivated. Please contact an administrator.",
    };
  }

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: user }));
  } catch (e) {
    console.error("Failed to store session", e);
  }

  return { success: true, user };
}

/**
 * Clear session and sign out
 */
export function logoutSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: null }));
  } catch (e) {
    console.error("Failed to clear session", e);
  }
}
