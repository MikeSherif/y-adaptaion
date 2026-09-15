import type { MaterialFilters, TaskFilters } from '@/shared/types/domain';
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
};
export const onboardingKeys = {
  all: ['onboarding'] as const,
  current: () => [...onboardingKeys.all, 'current'] as const,
};
export const stageKeys = {
  all: ['stage'] as const,
  detail: (id: string) => [...stageKeys.all, id] as const,
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
