import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markMaterialAsRead } from '@/shared/api';
import { materialKeys } from '@/shared/api/query-keys';
export function useMarkMaterialAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markMaterialAsRead,
    onSuccess: (material) => {
      void queryClient.invalidateQueries({ queryKey: materialKeys.all });
      queryClient.setQueryData(materialKeys.detail(material.id), material);
    },
  });
}
