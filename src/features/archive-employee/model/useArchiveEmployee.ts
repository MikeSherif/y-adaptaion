import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setEmployeeArchived } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';

export function useArchiveEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, archived }: { userId: string; archived: boolean }) =>
      setEmployeeArchived(userId, archived),
    onSuccess: () => invalidatePlan(queryClient),
  });
}
