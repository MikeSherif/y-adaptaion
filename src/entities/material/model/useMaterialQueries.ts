import { useQuery } from '@tanstack/react-query';
import { getMaterial, getMaterialReadStats, getMaterials } from '@/shared/api';
import { materialKeys } from '@/shared/api/query-keys';
import type { MaterialFilters } from '@/shared/types/domain';
export function useMaterialsQuery(filters: MaterialFilters = {}) {
  return useQuery({ queryKey: materialKeys.list(filters), queryFn: () => getMaterials(filters) });
}
export function useMaterialsByIds(ids: string[] = [], userId?: string) {
  const unique = [...new Set(ids)].sort();
  return useQuery({
    queryKey: materialKeys.list({ ids: unique, userId }),
    queryFn: () => getMaterials({ ids: unique, userId }),
    enabled: unique.length > 0,
    placeholderData: (previous) => previous,
  });
}
export function useMaterialReadStats(userId: string) {
  return useQuery({
    queryKey: materialKeys.stats(userId),
    queryFn: () => getMaterialReadStats(userId),
    enabled: Boolean(userId),
  });
}
export function useMaterialQuery(materialId: string) {
  return useQuery({
    queryKey: materialKeys.detail(materialId),
    queryFn: () => getMaterial(materialId),
    enabled: Boolean(materialId),
  });
}
