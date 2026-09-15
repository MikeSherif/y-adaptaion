export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type StageStatus = 'locked' | 'current' | 'completed';
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';
export type MaterialType = 'document' | 'video' | 'link' | 'presentation';
export type NotificationType = 'task' | 'material' | 'reminder' | 'system';

export interface Department {
  id: string;
  name: string;
}
export interface UserShort {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  avatarUrl?: string;
}
export interface User extends UserShort {
  middleName?: string;
  email: string;
  phone?: string;
  department: Department;
  startDate: string;
  manager?: UserShort;
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  assignee?: UserShort;
  stageId?: string;
  materialIds?: string[];
}
export interface OnboardingStage {
  id: string;
  title: string;
  description?: string;
  status: StageStatus;
  order: number;
  progress: number;
  startDate?: string;
  dueDate?: string;
  tasks: Task[];
}
export interface Onboarding {
  id: string;
  userId: string;
  status: OnboardingStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  stages: OnboardingStage[];
}
export interface Material {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
  category?: string;
  duration?: number;
  isRead: boolean;
}
export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sort?: 'dueDate' | 'priority';
}
export interface MaterialFilters {
  type?: MaterialType;
  category?: string;
  search?: string;
}
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
}
