import type { TaskPriority, TaskStatus } from '@/shared/types/domain';
import { Badge } from '@/shared/ui';
const statusMap: Record<
  TaskStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  todo: { label: 'К выполнению', tone: 'neutral' },
  in_progress: { label: 'В работе', tone: 'warning' },
  completed: { label: 'Готово', tone: 'success' },
  overdue: { label: 'Просрочено', tone: 'danger' },
};
const priorityMap: Record<TaskPriority, { label: string; tone: 'danger' | 'warning' | 'info' }> = {
  high: { label: 'Высокий', tone: 'danger' },
  medium: { label: 'Средний', tone: 'warning' },
  low: { label: 'Низкий', tone: 'info' },
};
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const item = statusMap[status];
  return <Badge tone={item.tone}>{item.label}</Badge>;
}
export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const item = priorityMap[priority];
  return <Badge tone={item.tone}>{item.label}</Badge>;
}
