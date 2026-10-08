import type { User } from '@/shared/types/domain';
import { findDepartment, findManager, findMentor } from './staff';

const design = findDepartment('design')!;

export const users: User[] = [
  {
    id: 'user-1',
    firstName: 'Алина',
    lastName: 'Ковалева',
    middleName: 'Сергеевна',
    email: 'employee@example.com',
    phone: '+7 913 555-12-74',
    role: 'employee',
    position: 'Product designer',
    department: design,
    startDate: '2026-09-28',
    manager: findManager('manager-1'),
    mentor: findMentor('buddy-1'),
    templateId: 'designer',
  },
  {
    id: 'user-2',
    firstName: 'Кирилл',
    lastName: 'Морозов',
    email: 'kirill.morozov@example.com',
    phone: '+7 913 555-19-03',
    role: 'employee',
    position: 'Junior product designer',
    department: design,
    startDate: '2026-10-05',
    manager: findManager('manager-1'),
    mentor: findMentor('buddy-1'),
    templateId: 'designer',
  },
  {
    id: 'user-admin',
    firstName: 'Олег',
    lastName: 'Белов',
    email: 'admin@example.com',
    phone: '+7 913 555-01-10',
    role: 'admin',
    position: 'HR business partner',
    department: findDepartment('hr')!,
    startDate: '2022-03-01',
  },
];

export function findUser(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalized);
}
