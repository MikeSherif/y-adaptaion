import { useQuery } from '@tanstack/react-query';
import { getStaff } from '@/shared/api';
import { staffKeys } from '@/shared/api/query-keys';

export function useStaffQuery() {
  return useQuery({ queryKey: staffKeys.all, queryFn: getStaff });
}
