import { Group, Project, Task, User } from "./types";
import { MOCK_GROUPS, MOCK_PROJECT_1, MOCK_PROJECT_2 } from "./mockData";
import { getStoredUsers } from "./userStore";

export const GROUPS_STORAGE_KEY = "veda_portal_groups_v1";
export const PROJECTS_STORAGE_KEY = "veda_portal_projects_v1";
export const PROJECT_UPDATE_EVENT = "veda:projects-updated";

/**
 * Get all projects from localStorage or mock data
 */
export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") {
    return [MOCK_PROJECT_1, MOCK_PROJECT_2];
  }
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      const initial = [MOCK_PROJECT_1, MOCK_PROJECT_2];
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [MOCK_PROJECT_1, MOCK_PROJECT_2];
  } catch {
    return [MOCK_PROJECT_1, MOCK_PROJECT_2];
  }
}

/**
 * Save projects to localStorage and emit sync event
 */
export function saveStoredProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent(PROJECT_UPDATE_EVENT, { detail: projects }));
  } catch (e) {
    console.error("Failed to save projects to localStorage", e);
  }
}

/**
 * Get all groups from localStorage or mock data, with mentors synchronized with userStore
 */
export function getStoredGroups(): Group[] {
  if (typeof window === "undefined") {
    return MOCK_GROUPS;
  }
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
    let groups: Group[] = [];
    if (!raw) {
      groups = MOCK_GROUPS;
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    } else {
      const parsed = JSON.parse(raw);
      groups = Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_GROUPS;
    }

    // Synchronize mentor user objects with latest userStore data
    const allUsers = getStoredUsers();
    return groups.map((g) => {
      const liveMentor = allUsers.find((u) => u.id === g.mentorId && u.role === "MENTOR");
      const liveInterns = g.interns.map((intern) => {
        const found = allUsers.find((u) => u.id === intern.id);
        return found || intern;
      });
      return {
        ...g,
        mentor: liveMentor || g.mentor,
        interns: liveInterns,
      };
    });
  } catch {
    return MOCK_GROUPS;
  }
}

/**
 * Save groups to localStorage and emit sync event
 */
export function saveStoredGroups(groups: Group[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    window.dispatchEvent(new CustomEvent(PROJECT_UPDATE_EVENT, { detail: groups }));
  } catch (e) {
    console.error("Failed to save groups to localStorage", e);
  }
}

/**
 * Add a new Project and optionally assign it to a group & mentor
 */
export function addProject(data: {
  title: string;
  problemStatement: string;
  expectedFinalOutput: string;
  groupId?: number;
  mentorId?: number;
  tasks?: { title: string; description: string; expectedOutput: string; dueDate?: string }[];
}): { success: boolean; project?: Project; error?: string } {
  const title = data.title.trim();
  if (!title) {
    return { success: false, error: "Project title is required." };
  }
  if (!data.problemStatement.trim()) {
    return { success: false, error: "Problem statement is required." };
  }
  if (!data.expectedFinalOutput.trim()) {
    return { success: false, error: "Expected final output is required." };
  }

  const projects = getStoredProjects();
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();

  const maxProjectId = projects.reduce((max, p) => Math.max(max, p.id), 0);
  const newProjectId = maxProjectId + 1;

  let assignedGroupId = data.groupId || (groups.length > 0 ? groups[0].id : 1);
  let assignedGroup = groups.find((g) => g.id === assignedGroupId);
  let groupCode = assignedGroup ? assignedGroup.code : `VEDA-0${assignedGroupId}`;

  // Build initial tasks
  const tasksList: Task[] =
    data.tasks && data.tasks.length > 0
      ? data.tasks.map((t, idx) => ({
          id: newProjectId * 100 + (idx + 1),
          projectId: newProjectId,
          projectTitle: title,
          number: idx + 1,
          title: t.title.trim() || `Task ${idx + 1}: Initial Deliverable`,
          description: t.description.trim(),
          expectedOutput: t.expectedOutput.trim(),
          dueDate: t.dueDate || "2026-11-15",
          status: "IN_PROGRESS",
          assignedInternsCount: assignedGroup ? assignedGroup.interns.length : 2,
          approvedCount: 0,
          totalSubmissions: 0,
        }))
      : [
          {
            id: newProjectId * 100 + 1,
            projectId: newProjectId,
            projectTitle: title,
            number: 1,
            title: "Task 1: Project Setup & Baseline Specification",
            description: "Set up project repository, environment dependencies, and design technical specifications.",
            expectedOutput: "GitHub repository with initial setup documentation and prototype branch.",
            dueDate: "2026-11-10",
            status: "IN_PROGRESS",
            assignedInternsCount: assignedGroup ? assignedGroup.interns.length : 2,
            approvedCount: 0,
            totalSubmissions: 0,
          },
        ];

  const newProject: Project = {
    id: newProjectId,
    groupId: assignedGroupId,
    groupCode,
    title,
    problemStatement: data.problemStatement.trim(),
    expectedFinalOutput: data.expectedFinalOutput.trim(),
    tasksCount: tasksList.length,
    tasks: tasksList,
  };

  const updatedProjects = [...projects, newProject];
  saveStoredProjects(updatedProjects);

  // If a group was assigned, update the group's active project and optionally reassign mentor
  if (assignedGroup) {
    const updatedGroups = groups.map((g) => {
      if (g.id === assignedGroupId) {
        let updatedMentor = g.mentor;
        let updatedMentorId = g.mentorId;
        if (data.mentorId) {
          const mentorUser = allUsers.find((u) => u.id === data.mentorId && u.role === "MENTOR");
          if (mentorUser) {
            updatedMentor = mentorUser;
            updatedMentorId = mentorUser.id;
          }
        }
        return {
          ...g,
          project: newProject,
          mentor: updatedMentor,
          mentorId: updatedMentorId,
        };
      }
      return g;
    });
    saveStoredGroups(updatedGroups);
  }

  return { success: true, project: newProject };
}

/**
 * Update an existing Project
 */
export function updateProject(
  id: number,
  updates: {
    title?: string;
    problemStatement?: string;
    expectedFinalOutput?: string;
    groupId?: number;
    mentorId?: number;
  }
): { success: boolean; project?: Project; error?: string } {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return { success: false, error: "Project not found." };
  }

  const current = projects[index];
  const newTitle = updates.title?.trim() || current.title;
  const newProblem = updates.problemStatement?.trim() || current.problemStatement;
  const newOutput = updates.expectedFinalOutput?.trim() || current.expectedFinalOutput;

  const groups = getStoredGroups();
  const allUsers = getStoredUsers();

  const targetGroupId = updates.groupId !== undefined ? updates.groupId : current.groupId;
  const targetGroup = groups.find((g) => g.id === targetGroupId);
  const groupCode = targetGroup ? targetGroup.code : current.groupCode;

  const updatedProject: Project = {
    ...current,
    title: newTitle,
    problemStatement: newProblem,
    expectedFinalOutput: newOutput,
    groupId: targetGroupId,
    groupCode,
  };

  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;
  saveStoredProjects(updatedProjects);

  // Sync groups
  const updatedGroups = groups.map((g) => {
    if (g.id === targetGroupId) {
      let updatedMentor = g.mentor;
      let updatedMentorId = g.mentorId;
      if (updates.mentorId) {
        const m = allUsers.find((u) => u.id === updates.mentorId && u.role === "MENTOR");
        if (m) {
          updatedMentor = m;
          updatedMentorId = m.id;
        }
      }
      return {
        ...g,
        project: updatedProject,
        mentor: updatedMentor,
        mentorId: updatedMentorId,
      };
    } else if (g.project && g.project.id === id && targetGroupId !== g.id) {
      const otherProj = updatedProjects.find((p) => p.id !== id) || updatedProjects[0];
      return {
        ...g,
        project: otherProj,
      };
    }
    return g;
  });
  saveStoredGroups(updatedGroups);

  return { success: true, project: updatedProject };
}

/**
 * Add a Task to a Project
 */
export function addTaskToProject(
  projectId: number,
  task: {
    title: string;
    description: string;
    expectedOutput: string;
    dueDate?: string;
  }
): { success: boolean; project?: Project; error?: string } {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) {
    return { success: false, error: "Project not found." };
  }

  const project = projects[index];
  const nextNumber = project.tasks.length + 1;
  const newTaskId = projectId * 100 + nextNumber;

  const newTask: Task = {
    id: newTaskId,
    projectId,
    projectTitle: project.title,
    number: nextNumber,
    title: task.title.trim() || `Task #${nextNumber}`,
    description: task.description.trim(),
    expectedOutput: task.expectedOutput.trim(),
    dueDate: task.dueDate || "2026-11-20",
    status: "IN_PROGRESS",
    assignedInternsCount: 2,
    approvedCount: 0,
    totalSubmissions: 0,
  };

  const updatedTasks = [...project.tasks, newTask];
  const updatedProject: Project = {
    ...project,
    tasksCount: updatedTasks.length,
    tasks: updatedTasks,
  };

  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;
  saveStoredProjects(updatedProjects);

  // Sync groups
  const groups = getStoredGroups();
  const updatedGroups = groups.map((g) => {
    if (g.project && g.project.id === projectId) {
      return {
        ...g,
        project: updatedProject,
      };
    }
    return g;
  });
  saveStoredGroups(updatedGroups);

  return { success: true, project: updatedProject };
}

/**
 * Delete a Task from a Project
 */
export function deleteTaskFromProject(
  projectId: number,
  taskId: number
): { success: boolean; project?: Project; error?: string } {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) {
    return { success: false, error: "Project not found." };
  }

  const project = projects[index];
  if (project.tasks.length <= 1) {
    return { success: false, error: "A project must contain at least one task." };
  }

  const updatedTasks = project.tasks
    .filter((t) => t.id !== taskId)
    .map((t, i) => ({
      ...t,
      number: i + 1,
    }));

  const updatedProject: Project = {
    ...project,
    tasksCount: updatedTasks.length,
    tasks: updatedTasks,
  };

  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;
  saveStoredProjects(updatedProjects);

  return { success: true, project: updatedProject };
}

/**
 * Delete a Project
 */
export function deleteProject(projectId: number): { success: boolean; error?: string } {
  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return { success: false, error: "Project not found." };
  }

  if (projects.length <= 1) {
    return {
      success: false,
      error: "At least one project must remain in the portal workspace.",
    };
  }

  const updatedProjects = projects.filter((p) => p.id !== projectId);
  saveStoredProjects(updatedProjects);

  // If any group had this project assigned, reassign them to another project
  const fallbackProject = updatedProjects[0];
  const groups = getStoredGroups();
  const updatedGroups = groups.map((g) => {
    if (g.project && g.project.id === projectId) {
      return {
        ...g,
        project: fallbackProject,
      };
    }
    return g;
  });
  saveStoredGroups(updatedGroups);

  return { success: true };
}

/**
 * Assign an existing Project to a Group and optionally a Mentor
 */
export function assignProjectToGroup(
  projectId: number,
  groupId: number,
  mentorId?: number
): { success: boolean; error?: string } {
  const projects = getStoredProjects();
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();

  const targetProject = projects.find((p) => p.id === projectId);
  const targetGroup = groups.find((g) => g.id === groupId);

  if (!targetProject) {
    return { success: false, error: "Project not found." };
  }
  if (!targetGroup) {
    return { success: false, error: "Cohort group not found." };
  }

  // Update Project's group assignment
  const updatedProjects = projects.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        groupId: targetGroup.id,
        groupCode: targetGroup.code,
      };
    }
    return p;
  });
  saveStoredProjects(updatedProjects);

  // Update Group's assigned project and mentor
  let updatedMentor = targetGroup.mentor;
  let updatedMentorId = targetGroup.mentorId;
  if (mentorId) {
    const mentorUser = allUsers.find((u) => u.id === mentorId && u.role === "MENTOR");
    if (mentorUser) {
      updatedMentor = mentorUser;
      updatedMentorId = mentorUser.id;
    }
  }

  const updatedGroupProject: Project = {
    ...targetProject,
    groupId: targetGroup.id,
    groupCode: targetGroup.code,
  };

  const updatedGroups = groups.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        project: updatedGroupProject,
        mentor: updatedMentor,
        mentorId: updatedMentorId,
      };
    }
    return g;
  });
  saveStoredGroups(updatedGroups);

  return { success: true };
}

/**
 * Reassign the supervising Mentor for a cohort Group
 */
export function assignMentorToGroup(
  groupId: number,
  mentorId: number
): { success: boolean; error?: string } {
  const groups = getStoredGroups();
  const allUsers = getStoredUsers();

  const group = groups.find((g) => g.id === groupId);
  if (!group) {
    return { success: false, error: "Cohort group not found." };
  }

  const mentorUser = allUsers.find((u) => u.id === mentorId && u.role === "MENTOR");
  if (!mentorUser) {
    return { success: false, error: "Selected mentor user not found." };
  }

  const updatedGroups = groups.map((g) => {
    if (g.id === groupId) {
      return {
        ...g,
        mentorId: mentorUser.id,
        mentor: mentorUser,
      };
    }
    return g;
  });
  saveStoredGroups(updatedGroups);

  return { success: true };
}

/**
 * Create a new Cohort Group
 */
export function addCohortGroup(data: {
  code: string;
  name: string;
  mentorId: number;
  projectId?: number;
}): { success: boolean; group?: Group; error?: string } {
  const code = data.code.trim().toUpperCase();
  if (!code) {
    return { success: false, error: "Cohort group code is required (e.g. VEDA-03)." };
  }

  const groups = getStoredGroups();
  if (groups.some((g) => g.code.toUpperCase() === code)) {
    return { success: false, error: `Group code "${code}" is already in use.` };
  }

  const allUsers = getStoredUsers();
  const mentorUser = allUsers.find((u) => u.id === data.mentorId && u.role === "MENTOR");
  if (!mentorUser) {
    return { success: false, error: "A valid mentor must be selected." };
  }

  const projects = getStoredProjects();
  const selectedProject =
    projects.find((p) => p.id === data.projectId) || projects[0] || MOCK_PROJECT_1;

  const maxGroupId = groups.reduce((max, g) => Math.max(max, g.id), 0);
  const newGroupId = maxGroupId + 1;

  // Find interns assigned to this group code
  const interns = allUsers.filter((u) => u.role === "INTERN" && u.assignedGroupCode === code);

  const newGroup: Group = {
    id: newGroupId,
    code,
    name: data.name.trim() || `${selectedProject.title} Cohort`,
    mentorId: mentorUser.id,
    mentor: mentorUser,
    interns,
    project: {
      ...selectedProject,
      groupId: newGroupId,
      groupCode: code,
    },
    progressPercentage: 0,
  };

  const updatedGroups = [...groups, newGroup];
  saveStoredGroups(updatedGroups);
  return { success: true, group: newGroup };
}

/**
 * Delete a cohort Group
 */
export function deleteCohortGroup(groupId: number): { success: boolean; error?: string } {
  const groups = getStoredGroups();
  if (groups.length <= 1) {
    return { success: false, error: "At least one cohort group must remain active." };
  }

  const updated = groups.filter((g) => g.id !== groupId);
  saveStoredGroups(updated);
  return { success: true };
}

/**
 * Reset projects and groups to default mock seeds
 */
export function resetProjectsAndGroups(): void {
  saveStoredProjects([MOCK_PROJECT_1, MOCK_PROJECT_2]);
  saveStoredGroups(MOCK_GROUPS);
}
