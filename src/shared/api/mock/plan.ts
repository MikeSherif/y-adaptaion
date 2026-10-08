import type { AssigneeRole, OnboardingTemplate, Task, User } from '@/shared/types/domain';
import { addDays } from '@/shared/lib/date';
import { findTemplate } from './templates';

interface PlanProgress {
  completed?: Record<string, string>;
  inProgress?: string[];
}

const planSnapshots = new Map<string, OnboardingTemplate>();

export function findPlan(user: Pick<User, 'id' | 'templateId'>): OnboardingTemplate {
  return planSnapshots.get(user.id) ?? findTemplate(user.templateId);
}

export function assignPlan(user: User, template: OnboardingTemplate, progress?: PlanProgress): Task[] {
  planSnapshots.set(user.id, structuredClone(template));
  return buildPlan(user, template, progress);
}

export function resolveAssignee(user: Pick<User, 'manager' | 'mentor'>, role?: AssigneeRole | null) {
  if (role === 'manager') return user.manager;
  if (role === 'mentor') return user.mentor;
  return undefined;
}

export function planEndDate(user: Pick<User, 'startDate'>, template: OnboardingTemplate): string {
  const last = template.stages[template.stages.length - 1];
  return addDays(user.startDate, last?.endOffset ?? 0);
}

export function buildPlan(
  user: User,
  template: OnboardingTemplate,
  progress: PlanProgress = {},
): Task[] {
  return template.stages.flatMap((stage) =>
    stage.tasks.map((item): Task => {
      const completedAt = progress.completed?.[item.id];
      return {
        id: `${user.id}-${item.id}`,
        userId: user.id,
        stageId: stage.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        dueDate: addDays(user.startDate, item.dayOffset),
        status: completedAt
          ? 'completed'
          : progress.inProgress?.includes(item.id)
            ? 'in_progress'
            : 'todo',
        completedAt,
        assignee: resolveAssignee(user, item.assignee),
        assigneeRole: item.assignee ?? undefined,
        materialIds: item.materialIds ? [...item.materialIds] : undefined,
      };
    }),
  );
}
