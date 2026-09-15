import type { OnboardingStage, StageStatus } from '@/shared/types/domain';
import { tasks } from './tasks';

type StageDefinition = Omit<OnboardingStage, 'tasks' | 'progress' | 'status'> & {
  taskIds: string[];
};
export const stageDefinitions: StageDefinition[] = [
  {
    id: 'stage-1',
    title: 'Первый день',
    description: 'Доступы, профиль и знакомство с ближайшими коллегами.',
    order: 1,
    startDate: '2026-09-08',
    dueDate: '2026-09-10',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  {
    id: 'stage-2',
    title: 'Погружение в компанию',
    description: 'Базовые правила, культура и обязательные вводные материалы.',
    order: 2,
    startDate: '2026-09-11',
    dueDate: '2026-09-14',
    taskIds: ['task-4', 'task-5', 'task-6', 'task-7'],
  },
  {
    id: 'stage-3',
    title: 'Погружение в продукт',
    description: 'Узнайте продукт, его пользователей и подход команды к дизайну.',
    order: 3,
    startDate: '2026-09-15',
    dueDate: '2026-09-19',
    taskIds: ['task-8', 'task-9', 'task-10', 'task-11'],
  },
  {
    id: 'stage-4',
    title: 'Первая практика',
    description: 'Примените знания на реальных задачах вместе с наставником.',
    order: 4,
    startDate: '2026-09-22',
    dueDate: '2026-09-29',
    taskIds: ['task-12', 'task-13', 'task-14', 'task-15'],
  },
  {
    id: 'stage-5',
    title: 'Самостоятельность',
    description: 'Закрепите процесс работы и договоритесь о целях на испытательный срок.',
    order: 5,
    startDate: '2026-10-01',
    dueDate: '2026-10-09',
    taskIds: ['task-16', 'task-17', 'task-18'],
  },
];
export function getStages(): OnboardingStage[] {
  const rawStages = stageDefinitions.map((stage) => {
    const stageTasks = stage.taskIds
      .map((id) => tasks.find((task) => task.id === id)!)
      .map((task) => ({ ...task }));
    const progress = Math.round(
      (stageTasks.filter((task) => task.status === 'completed').length / stageTasks.length) * 100,
    );
    return { ...stage, tasks: stageTasks, progress };
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
