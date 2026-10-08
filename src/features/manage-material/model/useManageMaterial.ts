import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMaterial, setMaterialArchived, updateMaterial } from '@/shared/api';
import { materialKeys } from '@/shared/api/query-keys';
import type { MaterialPayload } from '@/shared/types/domain';

function useInvalidateMaterials() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: materialKeys.all });
}

export function useCreateMaterial() {
  const onSuccess = useInvalidateMaterials();
  return useMutation({ mutationFn: createMaterial, onSuccess });
}

export function useUpdateMaterial(materialId: string) {
  const onSuccess = useInvalidateMaterials();
  return useMutation({
    mutationFn: (payload: MaterialPayload) => updateMaterial(materialId, payload),
    onSuccess,
  });
}

export function useArchiveMaterial() {
  const onSuccess = useInvalidateMaterials();
  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) => setMaterialArchived(id, archived),
    onSuccess,
  });
}
