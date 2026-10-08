import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendReminder } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';

export function useRemindEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendReminder,
    onSuccess: () => invalidatePlan(queryClient),
  });
}
