import { ArchiveToggleButton } from '@/shared/ui';
import { useArchiveEmployee } from '../model/useArchiveEmployee';

export function ArchiveEmployeeButton({
  userId,
  archived,
}: {
  userId: string;
  archived?: boolean;
}) {
  const archive = useArchiveEmployee();
  return (
    <ArchiveToggleButton
      archived={archived}
      loading={archive.isPending}
      onToggle={() => archive.mutate({ userId, archived: !archived })}
    />
  );
}
