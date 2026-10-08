import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDepartment,
  createStaffMember,
  setDepartmentArchived,
  setStaffArchived,
  updateDepartment,
  updateStaffMember,
} from '@/shared/api';
import { invalidateDirectory } from '@/shared/api/invalidate';
import type { DepartmentPayload, StaffKind, StaffPayload } from '@/shared/types/domain';

interface ArchiveInput {
  id: string;
  archived: boolean;
}

function useDirectoryMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => invalidateDirectory(queryClient) });
}

export const useSaveStaffMember = (kind: StaffKind) =>
  useDirectoryMutation(({ id, payload }: { id?: string; payload: StaffPayload }) =>
    id ? updateStaffMember(kind, id, payload) : createStaffMember(kind, payload),
  );

export const useArchiveStaffMember = (kind: StaffKind) =>
  useDirectoryMutation(({ id, archived }: ArchiveInput) => setStaffArchived(kind, id, archived));

export const useSaveDepartment = () =>
  useDirectoryMutation(({ id, payload }: { id?: string; payload: DepartmentPayload }) =>
    id ? updateDepartment(id, payload) : createDepartment(payload),
  );

export const useArchiveDepartment = () =>
  useDirectoryMutation(({ id, archived }: ArchiveInput) => setDepartmentArchived(id, archived));
