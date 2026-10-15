import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestDueDate } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import { taskKeys } from '@/shared/api/query-keys';
import type { DueDateRequestPayload } from '@/shared/types/domain';

export function useRequestDueDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: DueDateRequestPayload }) =>
      requestDueDate(taskId, payload),
    onSuccess: (task) => {
      invalidatePlan(queryClient);
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
  });
}
