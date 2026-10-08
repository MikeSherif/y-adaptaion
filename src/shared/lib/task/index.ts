import type { Task, TaskStatus } from '@/shared/types/domain';
import { isOverdue } from '@/shared/lib/date';

export function resolveTaskStatus(task: Pick<Task, 'status' | 'dueDate'>): TaskStatus {
  if (task.status === 'completed') return 'completed';
  if (isOverdue(task.dueDate)) return 'overdue';
  return task.status;
}

export function withResolvedStatus<T extends Task>(task: T): T {
  return { ...task, status: resolveTaskStatus(task) };
}
