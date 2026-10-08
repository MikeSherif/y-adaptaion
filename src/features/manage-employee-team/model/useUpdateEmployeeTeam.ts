import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployeeTeam } from '@/shared/api';
import { invalidatePlan } from '@/shared/api/invalidate';
import { userKeys } from '@/shared/api/query-keys';
import type { UpdateTeamPayload } from '@/shared/types/domain';

export function useUpdateEmployeeTeam(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTeamPayload) => updateEmployeeTeam(userId, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(user.id), user);
      invalidatePlan(queryClient);
    },
  });
}
