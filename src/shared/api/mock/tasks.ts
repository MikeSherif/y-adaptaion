import type { Task } from '@/shared/types/domain';
import { assignPlan } from './plan';
import { findTemplate } from './templates';
import { findUser } from './users';

const alina = findUser('user-1')!;
const kirill = findUser('user-2')!;

export const tasks: Task[] = [
  ...assignPlan(alina, findTemplate(alina.templateId), {
    completed: {
      'task-1': '2026-09-29',
      'task-2': '2026-09-30',
      'task-3': '2026-09-29',
      'task-4': '2026-10-01',
      'task-5': '2026-10-02',
      'task-6': '2026-10-03',
      'task-7': '2026-10-04',
    },
    inProgress: ['task-8'],
  }),
  ...assignPlan(kirill, findTemplate(kirill.templateId), {
    completed: {
      'task-1': '2026-10-06',
      'task-2': '2026-10-07',
      'task-3': '2026-10-07',
    },
  }),
];
