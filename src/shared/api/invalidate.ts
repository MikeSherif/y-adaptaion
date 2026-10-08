import type { QueryClient } from '@tanstack/react-query';
import {
  activityKeys,
  commentKeys,
  departmentKeys,
  notificationKeys,
  staffKeys,
  onboardingKeys,
  stageKeys,
  taskKeys,
  userKeys,
} from './query-keys';

const planKeys = [
  taskKeys.all,
  onboardingKeys.all,
  stageKeys.all,
  userKeys.all,
  notificationKeys.all,
  activityKeys.all,
  commentKeys.all,
];

export function invalidatePlan(queryClient: QueryClient) {
  planKeys.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
}

export function invalidateDirectory(queryClient: QueryClient) {
  invalidatePlan(queryClient);
  [staffKeys.all, departmentKeys.all].forEach(
    (queryKey) => void queryClient.invalidateQueries({ queryKey }),
  );
}
