import type { OnboardingStage, StageStatus } from '@/shared/types/domain';
import { addDays } from '@/shared/lib/date';
import { withResolvedStatus } from '@/shared/lib/task';
import { tasks } from './tasks';
import { findPlan } from './plan';
import { findUser } from './users';

const byDueDate = (a: { dueDate?: string }, b: { dueDate?: string }) =>
  (a.dueDate ?? '').localeCompare(b.dueDate ?? '');

export function getStages(userId: string): OnboardingStage[] {
  const user = findUser(userId);
  if (!user) return [];
  const template = findPlan(user);

  const rawStages = template.stages.map((stage) => {
    const stageTasks = tasks
      .filter((task) => task.userId === userId && task.stageId === stage.id)
      .map((task) => withResolvedStatus({ ...task }))
      .sort(byDueDate);
    const done = stageTasks.filter((task) => task.status === 'completed').length;
    return {
      id: stage.id,
      title: stage.title,
      description: stage.description,
      order: stage.order,
      startDate: addDays(user.startDate, stage.startOffset),
      dueDate: addDays(user.startDate, stage.endOffset),
      tasks: stageTasks,
      progress: stageTasks.length === 0 ? 100 : Math.round((done / stageTasks.length) * 100),
    };
  });

  let currentFound = false;
  return rawStages.map((stage) => {
    let status: StageStatus = 'locked';
    if (stage.progress === 100) status = 'completed';
    else if (!currentFound) {
      status = 'current';
      currentFound = true;
    }
    return { ...stage, status };
  });
}
