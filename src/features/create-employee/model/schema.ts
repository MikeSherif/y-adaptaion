import { z } from 'zod';

export const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(2, 'Минимум 2 символа'),
  lastName: z.string().trim().min(2, 'Минимум 2 символа'),
  email: z.string().trim().email('Некорректный email'),
  position: z.string().trim().min(2, 'Укажите должность'),
  departmentId: z.string().min(1, 'Выберите отдел'),
  startDate: z.string().min(1, 'Укажите дату выхода'),
  managerId: z.string().min(1, 'Выберите руководителя'),
  mentorId: z.string(),
  templateId: z.string().min(1, 'Выберите шаблон'),
});

export type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;
