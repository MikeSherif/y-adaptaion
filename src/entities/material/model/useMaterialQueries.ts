import { useQuery } from '@tanstack/react-query';
import { getMaterial, getMaterials } from '@/shared/api';
import { materialKeys } from '@/shared/api/query-keys';
import type { MaterialFilters } from '@/shared/types/domain';
export function useMaterialsQuery(filters: MaterialFilters = {}) {
  return useQuery({ queryKey: materialKeys.list(filters), queryFn: () => getMaterials(filters) });
}
export function useMaterialQuery(materialId: string) {
  return useQuery({
    queryKey: materialKeys.detail(materialId),
    queryFn: () => getMaterial(materialId),
  });
}
