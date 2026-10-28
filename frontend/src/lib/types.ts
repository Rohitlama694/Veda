export type UserRole = "ADMIN" | "MENTOR" | "INTERN";
export type SubmissionStatus = "PENDING" | "CORRECTIONS_REQUESTED" | "APPROVED";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  department?: string;
  joinedDate: string;
  assignedGroupCode?: string;
  password?: string;
}

export interface Review {
  id: number;
  attemptId: number;
  mentorId: number;
  mentorName: string;
  mentorAvatar?: string;
  decision: "CORRECTIONS_REQUESTED" | "APPROVED";
  feedback: string;
  createdAt: string;
}

export interface SubmissionAttempt {
  id: number;
  taskId: number;
  taskTitle: string;
  taskNumber: number;
  projectId: number;
  projectTitle: string;
  internId: number;
  internName: string;
  internEmail: string;
  internAvatar?: string;
  mentorId: number;
  mentorName: string;
  mentorAvatar?: string;
  repositoryUrl: string;
  note: string;
  version: number;
  status: SubmissionStatus;
  createdAt: string;
  reviews: Review[];
}

export interface Task {
  id: number;
  projectId: number;
  projectTitle: string;
  number: number;
  title: string;
  description: string;
  expectedOutput: string;
  dueDate: string;
  status?: string;
  assignedInternsCount: number;
  approvedCount: number;
  totalSubmissions: number;
}

export interface Project {
  id: number;
  groupId: number;
  groupCode: string;
  title: string;
  problemStatement: string;
  expectedFinalOutput: string;
  tasksCount: number;
  tasks: Task[];
}

export interface Group {
  id: number;
  code: string;
  name: string;
  mentorId: number;
  mentor: User;
  interns: User[];
  project: Project;
  progressPercentage: number;
}

export interface DashboardKPIs {
  totalUsers: number;
  usersTrend: string;
  activeInterns: number;
  internsLabel: string;
  pendingReviews: number;
  pendingLabel: string;
  approvedAttempts: number;
  approvedTrend: string;
}

export interface SubmissionOverviewStats {
  approved: number;
  pending: number;
  correctionsRequested: number;
  total: number;
}
