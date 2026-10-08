import type { Material } from '@/shared/types/domain';
import { ArchiveToggleButton } from '@/shared/ui';
import { useArchiveMaterial } from '../model/useManageMaterial';

export function ArchiveMaterialButton({ material }: { material: Material }) {
  const archive = useArchiveMaterial();
  return (
    <ArchiveToggleButton
      archived={material.archived}
      loading={archive.isPending}
      onToggle={() => archive.mutate({ id: material.id, archived: !material.archived })}
    />
  );
}
