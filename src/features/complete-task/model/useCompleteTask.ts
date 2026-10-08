import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTask } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import { taskKeys } from '@/shared/api/query-keys';
export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: (task, taskId) => {
      invalidatePlan(queryClient);
      queryClient.setQueryData(taskKeys.detail(taskId), task);
    },
  });
}
