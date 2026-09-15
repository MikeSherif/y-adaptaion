import { useQuery } from '@tanstack/react-query';
import { getTask, getTasks } from '@/shared/api';
import { taskKeys } from '@/shared/api/query-keys';
import type { TaskFilters } from '@/shared/types/domain';
export function useTasksQuery(filters: TaskFilters = {}) {
  return useQuery({ queryKey: taskKeys.list(filters), queryFn: () => getTasks(filters) });
}
export function useTaskQuery(taskId: string) {
  return useQuery({ queryKey: taskKeys.detail(taskId), queryFn: () => getTask(taskId) });
}
