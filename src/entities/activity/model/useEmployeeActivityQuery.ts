import { useQuery } from '@tanstack/react-query';
import { getEmployeeActivity } from '@/shared/api';
import { activityKeys } from '@/shared/api/query-keys';

export function useEmployeeActivityQuery(userId: string) {
  return useQuery({
    queryKey: activityKeys.byEmployee(userId),
    queryFn: () => getEmployeeActivity(userId),
  });
}
