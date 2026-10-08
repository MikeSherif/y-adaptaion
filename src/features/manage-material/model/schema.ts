import { z } from 'zod';
import type { Material, MaterialPayload } from '@/shared/types/domain';

export const materialSchema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  description: z.string(),
  type: z.enum(['document', 'video', 'link', 'presentation']),
  url: z.string().trim().url('Укажите ссылку вида https://…'),
  category: z.string().min(1, 'Выберите категорию'),
  duration: z
    .string()
    .trim()
    .refine((value) => value === '' || (Number.isInteger(Number(value)) && Number(value) > 0), {
      message: 'Целое число минут',
    }),
});

export type MaterialValues = z.infer<typeof materialSchema>;

export const toMaterialValues = (material?: Material): MaterialValues => ({
  title: material?.title ?? '',
  description: material?.description ?? '',
  type: material?.type ?? 'document',
  url: material?.url ?? '',
  category: material?.category ?? '',
  duration: material?.duration ? String(material.duration) : '',
});

export const toMaterialPayload = ({ duration, ...values }: MaterialValues): MaterialPayload => ({
  ...values,
  duration: duration ? Number(duration) : undefined,
});
