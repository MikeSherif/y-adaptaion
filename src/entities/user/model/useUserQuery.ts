import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/shared/api';
import { userKeys } from '@/shared/api/query-keys';
export function useUserQuery() {
  return useQuery({ queryKey: userKeys.current(), queryFn: getCurrentUser });
}
