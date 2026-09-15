import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/shared/api';
import { userKeys } from '@/shared/api/query-keys';
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.current(), user);
    },
  });
}
