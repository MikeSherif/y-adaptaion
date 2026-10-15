import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveDueDateRequest } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import { taskKeys } from '@/shared/api/query-keys';

export function useResolveDueDateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, decision }: { taskId: string; decision: 'approved' | 'rejected' }) =>
      resolveDueDateRequest(taskId, decision),
    onSuccess: (task) => {
      invalidatePlan(queryClient);
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
  });
}
