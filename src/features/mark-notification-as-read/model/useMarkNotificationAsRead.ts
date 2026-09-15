import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead } from '@/shared/api';
import { notificationKeys } from '@/shared/api/query-keys';
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
