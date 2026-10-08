import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => invalidatePlan(queryClient),
  });
}
