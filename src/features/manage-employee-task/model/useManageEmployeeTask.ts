import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, updateTask } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import { taskKeys } from '@/shared/api/query-keys';
import type { UpdateTaskPayload } from '@/shared/types/domain';

export function useCreateEmployeeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      invalidatePlan(queryClient);
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
  });
}

export function useUpdateEmployeeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, patch }: { taskId: string; patch: UpdateTaskPayload }) =>
      updateTask(taskId, patch),
    onSuccess: (task) => {
      invalidatePlan(queryClient);
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
  });
}

export function useRemoveEmployeeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_result, taskId) => {
      invalidatePlan(queryClient);
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
