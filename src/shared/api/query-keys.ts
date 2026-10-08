import type { MaterialFilters, TaskFilters } from '@/shared/types/domain';
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  employees: () => [...userKeys.all, 'employees'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
export const onboardingKeys = {
  all: ['onboarding'] as const,
  current: () => [...onboardingKeys.all, 'current'] as const,
  byUser: (userId?: string) => [...onboardingKeys.all, userId ?? 'current'] as const,
};
export const stageKeys = {
  all: ['stage'] as const,
  detail: (id: string, userId?: string) => [...stageKeys.all, id, userId ?? 'current'] as const,
};
export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: TaskFilters = {}) => [...taskKeys.all, 'list', filters] as const,
  detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
};
export const materialKeys = {
  all: ['materials'] as const,
  list: (filters: MaterialFilters = {}) => [...materialKeys.all, 'list', filters] as const,
  detail: (id: string) => [...materialKeys.all, 'detail', id] as const,
};
export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};
export const templateKeys = {
  all: ['templates'] as const,
  list: () => [...templateKeys.all, 'list'] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};
export const staffKeys = {
  all: ['staff'] as const,
};
export const departmentKeys = {
  all: ['departments'] as const,
};
export const activityKeys = {
  all: ['activity'] as const,
  byEmployee: (employeeId: string) => [...activityKeys.all, employeeId] as const,
};
export const commentKeys = {
  all: ['comments'] as const,
  byTask: (taskId: string) => [...commentKeys.all, taskId] as const,
};
