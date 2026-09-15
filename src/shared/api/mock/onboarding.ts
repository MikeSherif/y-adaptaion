import type { Onboarding } from '@/shared/types/domain';
import { getStages } from './stages';
export function getMockOnboarding(): Onboarding {
  const stages = getStages();
  const allTasks = stages.flatMap((stage) => stage.tasks);
  const progress = Math.round(
    (allTasks.filter((task) => task.status === 'completed').length / allTasks.length) * 100,
  );
  return {
    id: 'onboarding-1',
    userId: 'user-1',
    status: 'in_progress',
    startDate: '2026-09-08',
    endDate: '2026-10-09',
    progress,
    stages,
  };
}
