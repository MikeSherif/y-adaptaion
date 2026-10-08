import { z } from 'zod';
import type { User } from '@/shared/types/domain';

export const employeeProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'Минимум 2 символа'),
  lastName: z.string().trim().min(2, 'Минимум 2 символа'),
  email: z.string().trim().email('Некорректный email'),
  position: z.string().trim().min(2, 'Укажите должность'),
  departmentId: z.string().min(1, 'Выберите отдел'),
  startDate: z.string().min(1, 'Укажите дату выхода'),
});

export type EmployeeProfileValues = z.infer<typeof employeeProfileSchema>;

export const toEmployeeProfileValues = (user: User): EmployeeProfileValues => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  position: user.position,
  departmentId: user.department.id,
  startDate: user.startDate,
});
