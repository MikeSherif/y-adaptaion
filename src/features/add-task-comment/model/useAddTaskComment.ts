import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTaskComment } from '@/shared/api';
import { activityKeys, commentKeys, notificationKeys, userKeys } from '@/shared/api/query-keys';

export function useAddTaskComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addTaskComment(taskId, text),
    onSuccess: () => {
      [commentKeys.byTask(taskId), activityKeys.all, notificationKeys.all, userKeys.employees()].forEach(
        (queryKey) => void queryClient.invalidateQueries({ queryKey }),
      );
    },
  });
}
