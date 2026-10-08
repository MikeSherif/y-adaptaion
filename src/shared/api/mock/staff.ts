import type { Department, StaffKind, StaffMember, UserShort } from '@/shared/types/domain';

export const managers: StaffMember[] = [
  { id: 'manager-1', firstName: 'Мария', lastName: 'Соколова', position: 'Head of Design' },
  { id: 'manager-2', firstName: 'Анна', lastName: 'Лебедева', position: 'Head of Product' },
  { id: 'manager-3', firstName: 'Павел', lastName: 'Гришин', position: 'Engineering manager' },
];

export const mentors: StaffMember[] = [
  { id: 'buddy-1', firstName: 'Илья', lastName: 'Воронов', position: 'Senior product designer' },
  { id: 'buddy-2', firstName: 'Дмитрий', lastName: 'Орлов', position: 'Frontend lead' },
  { id: 'buddy-3', firstName: 'Ольга', lastName: 'Ким', position: 'Product analyst' },
];

export const departments: Department[] = [
  { id: 'design', name: 'Продуктовый дизайн' },
  { id: 'product', name: 'Продукт' },
  { id: 'engineering', name: 'Разработка' },
  { id: 'analytics', name: 'Аналитика' },
  { id: 'hr', name: 'HR' },
];

export const staffByKind: Record<StaffKind, StaffMember[]> = { manager: managers, mentor: mentors };

export const toUserShort = ({ id, firstName, lastName, position }: StaffMember): UserShort => ({
  id,
  firstName,
  lastName,
  position,
});
export const toDepartmentRef = ({ id, name }: Department): Department => ({ id, name });

const findShort = (list: StaffMember[], id?: string) => {
  const member = list.find((item) => item.id === id);
  return member && toUserShort(member);
};
export const findManager = (id?: string) => findShort(managers, id);
export const findMentor = (id?: string) => findShort(mentors, id);
export const findDepartment = (id: string) => {
  const department = departments.find((item) => item.id === id);
  return department && toDepartmentRef(department);
};
