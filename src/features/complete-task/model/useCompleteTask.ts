import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTask } from '@/shared/api';
import { onboardingKeys, stageKeys, taskKeys } from '@/shared/api/query-keys';
export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTask,
    onSuccess: (_, taskId) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
      void queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
      void queryClient.invalidateQueries({ queryKey: stageKeys.all });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.setQueryData(taskKeys.detail(taskId), _);
    },
  });
}
