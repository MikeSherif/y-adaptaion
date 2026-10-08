import type { ActivityEntry } from '@/shared/types/domain';

const hr = { actorId: 'user-admin', actorName: 'Олег Белов' };

export const activity: ActivityEntry[] = [
  {
    id: 'activity-1',
    employeeId: 'user-1',
    ...hr,
    kind: 'employee_created',
    title: 'Сотрудник добавлен',
    description: 'План «Продуктовый дизайнер», выход 28 сентября',
    createdAt: '2026-09-25T10:00:00',
  },
  {
    id: 'activity-2',
    employeeId: 'user-1',
    ...hr,
    kind: 'team_changed',
    title: 'Назначена команда',
    description: 'Руководитель Мария Соколова, наставник Илья Воронов',
    createdAt: '2026-09-25T10:05:00',
  },
  {
    id: 'activity-3',
    employeeId: 'user-1',
    ...hr,
    kind: 'reminder',
    title: 'Напоминание о задачах',
    description: 'Просрочено: Изучить гайд по продукту',
    taskId: 'user-1-task-8',
    createdAt: '2026-10-07T11:20:00',
  },
  {
    id: 'activity-4',
    employeeId: 'user-2',
    ...hr,
    kind: 'employee_created',
    title: 'Сотрудник добавлен',
    description: 'План «Продуктовый дизайнер», выход 5 октября',
    createdAt: '2026-10-01T09:30:00',
  },
];
