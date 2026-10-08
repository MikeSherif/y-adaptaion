import type { Department, StaffKind, StaffMember } from '@/shared/types/domain';
import { ArchiveToggleButton } from '@/shared/ui';
import { useArchiveDepartment, useArchiveStaffMember } from '../model/useManageDirectory';

export function ArchiveStaffButton({ kind, member }: { kind: StaffKind; member: StaffMember }) {
  const archive = useArchiveStaffMember(kind);
  return (
    <ArchiveToggleButton
      archived={member.archived}
      loading={archive.isPending}
      onToggle={() => archive.mutate({ id: member.id, archived: !member.archived })}
    />
  );
}

export function ArchiveDepartmentButton({ department }: { department: Department }) {
  const archive = useArchiveDepartment();
  return (
    <ArchiveToggleButton
      archived={department.archived}
      loading={archive.isPending}
      onToggle={() => archive.mutate({ id: department.id, archived: !department.archived })}
    />
  );
}
