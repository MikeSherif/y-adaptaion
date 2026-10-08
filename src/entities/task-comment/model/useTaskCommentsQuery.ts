import { useQuery } from '@tanstack/react-query';
import { getTaskComments } from '@/shared/api';
import { commentKeys } from '@/shared/api/query-keys';

export function useTaskCommentsQuery(taskId: string) {
  return useQuery({ queryKey: commentKeys.byTask(taskId), queryFn: () => getTaskComments(taskId) });
}
