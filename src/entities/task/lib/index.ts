import type { TaskPriority } from '@/shared/types/domain';

export const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'low', label: 'Низкий' },
];
