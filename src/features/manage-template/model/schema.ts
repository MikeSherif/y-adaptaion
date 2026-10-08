import { z } from 'zod';
import type { OnboardingTemplate, TemplatePayload } from '@/shared/types/domain';

const day = z
  .number({ invalid_type_error: 'Укажите день' })
  .int('Целое число')
  .min(1, 'Не раньше дня 1')
  .max(365, 'Не позже дня 365');

export const templateTaskSchema = z.object({
  refId: z.string().optional(),
  title: z.string().trim().min(3, 'Минимум 3 символа'),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  day,
  assignee: z.enum(['', 'manager', 'mentor']),
  materialIds: z.array(z.string()),
});

export const templateStageSchema = z.object({
  refId: z.string().optional(),
  title: z.string().trim().min(2, 'Укажите название этапа'),
  description: z.string(),
  startDay: day,
  endDay: day,
  tasks: z.array(templateTaskSchema).min(1, 'Добавьте хотя бы одну задачу'),
});

export const templateSchema = z
  .object({
    title: z.string().trim().min(3, 'Минимум 3 символа'),
    description: z.string(),
    stages: z.array(templateStageSchema).min(1, 'Добавьте хотя бы один этап'),
  })
  .superRefine(({ stages }, ctx) => {
    stages.forEach((stage, stageIndex) => {
      if (stage.endDay < stage.startDay) {
        ctx.addIssue({
          code: 'custom',
          path: ['stages', stageIndex, 'endDay'],
          message: 'Не раньше дня начала',
        });
        return;
      }
      stage.tasks.forEach((task, taskIndex) => {
        if (task.day < stage.startDay || task.day > stage.endDay) {
          ctx.addIssue({
            code: 'custom',
            path: ['stages', stageIndex, 'tasks', taskIndex, 'day'],
            message: `В пределах этапа: дни ${stage.startDay}–${stage.endDay}`,
          });
        }
      });
    });
  });

export type TemplateValues = z.infer<typeof templateSchema>;
export type TemplateStageValues = z.infer<typeof templateStageSchema>;
export type TemplateTaskValues = z.infer<typeof templateTaskSchema>;

export const emptyTask = (dayNumber: number): TemplateTaskValues => ({
  title: '',
  description: '',
  priority: 'medium',
  day: dayNumber,
  assignee: '',
  materialIds: [],
});

export const emptyStage = (startDay: number): TemplateStageValues => ({
  title: '',
  description: '',
  startDay,
  endDay: startDay + 2,
  tasks: [emptyTask(startDay)],
});

export function toTemplateValues(template?: OnboardingTemplate, { copy = false } = {}): TemplateValues {
  if (!template) return { title: '', description: '', stages: [emptyStage(1)] };
  return {
    title: copy ? `${template.title} (копия)` : template.title,
    description: template.description,
    stages: template.stages.map((stage) => ({
      refId: copy ? undefined : stage.id,
      title: stage.title,
      description: stage.description ?? '',
      startDay: stage.startOffset + 1,
      endDay: stage.endOffset + 1,
      tasks: stage.tasks.map((task) => ({
        refId: copy ? undefined : task.id,
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        day: task.dayOffset + 1,
        assignee: task.assignee ?? '',
        materialIds: task.materialIds ?? [],
      })),
    })),
  };
}

export function toTemplatePayload(values: TemplateValues): TemplatePayload {
  return {
    title: values.title,
    description: values.description,
    stages: values.stages.map((stage) => ({
      id: stage.refId,
      title: stage.title,
      description: stage.description,
      startOffset: stage.startDay - 1,
      endOffset: stage.endDay - 1,
      tasks: stage.tasks.map((task) => ({
        id: task.refId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dayOffset: task.day - 1,
        assignee: task.assignee || null,
        materialIds: task.materialIds,
      })),
    })),
  };
}

const safeDay = (value: number, fallback = 1) => (Number.isFinite(value) && value > 0 ? value : fallback);

export function toPreviewTemplate(values: TemplateValues): OnboardingTemplate {
  return {
    id: 'preview',
    title: values.title,
    description: values.description,
    stages: values.stages.map((stage, stageIndex) => ({
      id: `preview-stage-${stageIndex}`,
      title: stage.title || `Этап ${stageIndex + 1}`,
      description: stage.description,
      order: stageIndex + 1,
      startOffset: safeDay(stage.startDay) - 1,
      endOffset: safeDay(stage.endDay, safeDay(stage.startDay)) - 1,
      tasks: stage.tasks.map((task, taskIndex) => ({
        id: `preview-task-${stageIndex}-${taskIndex}`,
        title: task.title || 'Без названия',
        priority: task.priority,
        dayOffset: safeDay(task.day) - 1,
        assignee: task.assignee || null,
        materialIds: task.materialIds,
      })),
    })),
  };
}
