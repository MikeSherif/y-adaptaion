import { z } from 'zod';
export const profileSchema = z.object({
  firstName: z.string().min(2, 'Минимум 2 символа'),
  lastName: z.string().min(2, 'Минимум 2 символа'),
  middleName: z.string().optional(),
  phone: z.string().min(8, 'Укажите номер телефона').optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;
