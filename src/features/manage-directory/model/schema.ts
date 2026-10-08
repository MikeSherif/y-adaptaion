import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().trim().min(2, 'Минимум 2 символа'),
  lastName: z.string().trim().min(2, 'Минимум 2 символа'),
  position: z.string().trim().min(2, 'Укажите должность'),
});

export const departmentSchema = z.object({
  name: z.string().trim().min(2, 'Минимум 2 символа'),
});

export type StaffValues = z.infer<typeof staffSchema>;
export type DepartmentValues = z.infer<typeof departmentSchema>;
