import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '@/shared/api';
import { departmentKeys } from '@/shared/api/query-keys';

export function useDepartmentsQuery() {
  return useQuery({ queryKey: departmentKeys.all, queryFn: getDepartments });
}
