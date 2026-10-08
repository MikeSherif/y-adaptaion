import { useQuery } from '@tanstack/react-query';
import { getEmployees, getUser } from '@/shared/api';
import { userKeys } from '@/shared/api/query-keys';

export function useEmployeesQuery() {
  return useQuery({ queryKey: userKeys.employees(), queryFn: getEmployees });
}

export function useUserByIdQuery(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
  });
}
