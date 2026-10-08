import { z } from 'zod';

export const taskFieldsSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  dueDate: z.string().min(1, 'Укажите срок'),
  priority: z.enum(['low', 'medium', 'high']),
  description: z.string(),
  materialIds: z.array(z.string()),
});

export const createEmployeeTaskSchema = taskFieldsSchema.extend({
  stageId: z.string().min(1, 'Выберите этап'),
});

export type TaskFieldsValues = z.infer<typeof taskFieldsSchema>;
export type CreateEmployeeTaskValues = z.infer<typeof createEmployeeTaskSchema>;
