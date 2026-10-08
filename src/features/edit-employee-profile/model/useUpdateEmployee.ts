import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import type { UpdateEmployeePayload } from '@/shared/types/domain';

export function useUpdateEmployee(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => updateEmployee(userId, payload),
    onSuccess: () => invalidatePlan(queryClient),
  });
}
