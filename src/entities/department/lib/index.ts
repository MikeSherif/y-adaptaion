import type { Department } from '@/shared/types/domain';

export const toDepartmentOption = (department: Department) => ({
  value: department.id,
  label: department.name,
});
