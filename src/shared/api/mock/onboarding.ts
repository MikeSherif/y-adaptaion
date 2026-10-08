import type { Onboarding } from '@/shared/types/domain';
import { findUser } from './users';
import { getStages } from './stages';
import { findPlan, planEndDate } from './plan';

export function getMockOnboarding(userId: string): Onboarding {
  const user = findUser(userId);
  const stages = getStages(userId);
  const allTasks = stages.flatMap((stage) => stage.tasks);
  const progress = allTasks.length
    ? Math.round(
        (allTasks.filter((task) => task.status === 'completed').length / allTasks.length) * 100,
      )
    : 0;
  return {
    id: `onboarding-${userId}`,
    userId,
    status: progress === 100 ? 'completed' : allTasks.length === 0 ? 'not_started' : 'in_progress',
    startDate: user?.startDate ?? '',
    endDate: user ? planEndDate(user, findPlan(user)) : undefined,
    progress,
    stages,
  };
}
