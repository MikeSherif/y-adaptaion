export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type StageStatus = 'locked' | 'current' | 'completed';
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';
export type MaterialType = 'document' | 'video' | 'link' | 'presentation';
export type NotificationType = 'task' | 'material' | 'reminder' | 'system';
export type UserRole = 'employee' | 'admin';
export type AssigneeRole = 'manager' | 'mentor';
export type ActivityKind =
  | 'employee_created'
  | 'task_created'
  | 'task_updated'
  | 'task_removed'
  | 'reminder'
  | 'team_changed'
  | 'profile_changed'
  | 'comment';
export type StaffKind = 'manager' | 'mentor';

export interface Department {
  id: string;
  name: string;
  archived?: boolean;
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
  role: UserRole;
  department: Department;
  startDate: string;
  manager?: UserShort;
  mentor?: UserShort;
  templateId?: string;
}
export interface EmployeeSummary {
  user: User;
  progress: number;
  currentStageTitle?: string;
  overdueCount: number;
  openQuestions: number;
  lastRemindedAt?: string;
}
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  assignee?: UserShort;
  assigneeRole?: AssigneeRole;
  stageId?: string;
  materialIds?: string[];
}
export interface TemplateTask {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dayOffset: number;
  assignee: AssigneeRole | null;
  materialIds?: string[];
}
export interface TemplateStage {
  id: string;
  title: string;
  description?: string;
  order: number;
  startOffset: number;
  endOffset: number;
  tasks: TemplateTask[];
}
export interface OnboardingTemplate {
  id: string;
  title: string;
  description: string;
  stages: TemplateStage[];
  archived?: boolean;
}
export interface ActivityEntry {
  id: string;
  employeeId: string;
  actorId: string;
  actorName: string;
  kind: ActivityKind;
  title: string;
  description?: string;
  taskId?: string;
  createdAt: string;
}
export interface TaskComment {
  id: string;
  taskId: string;
  employeeId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}
export interface StaffMember extends UserShort {
  archived?: boolean;
}
export interface Staff {
  managers: StaffMember[];
  mentors: StaffMember[];
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
  archived?: boolean;
}
export interface Notification {
  id: string;
  userId: string;
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
  userId?: string;
}
export interface MaterialFilters {
  type?: MaterialType;
  category?: string;
  search?: string;
  ids?: string[];
  includeArchived?: boolean;
}
export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  risk?: 'overdue' | 'on_track' | 'completed' | 'questions';
  stage?: string;
}
export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
}
export interface CreateTaskPayload {
  userId: string;
  stageId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  materialIds?: string[];
}
export type UpdateTaskPayload = Partial<
  Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'materialIds'>
>;
export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: string;
  startDate: string;
  managerId: string;
  mentorId?: string;
  templateId: string;
}
export interface UpdateTeamPayload {
  managerId: string;
  mentorId?: string;
}
export type UpdateEmployeePayload = Pick<
  CreateEmployeePayload,
  'firstName' | 'lastName' | 'email' | 'position' | 'departmentId' | 'startDate'
>;
export type MaterialPayload = Pick<Material, 'title' | 'description' | 'type' | 'url' | 'category' | 'duration'>;
export type StaffPayload = Pick<UserShort, 'firstName' | 'lastName' | 'position'>;
export type DepartmentPayload = Pick<Department, 'name'>;
export type TemplateTaskPayload = Omit<TemplateTask, 'id'> & { id?: string };
export type TemplateStagePayload = Omit<TemplateStage, 'id' | 'order' | 'tasks'> & {
  id?: string;
  tasks: TemplateTaskPayload[];
};
export interface TemplatePayload {
  title: string;
  description: string;
  stages: TemplateStagePayload[];
}
