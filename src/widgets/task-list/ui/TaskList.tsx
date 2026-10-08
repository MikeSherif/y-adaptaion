import type { Task } from '@/shared/types/domain';
import { TaskCard } from '@/entities/task';
import { CompleteTaskButton } from '@/features/complete-task';
import { Card, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import styles from '@/pages/page.module.css';

interface TaskListProps {
  tasks?: Task[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}
export function TaskList({ tasks, isLoading, isError, onRetry }: TaskListProps) {
  if (isLoading)
    return (
      <div className={styles.taskGrid}>
        <Skeleton height={110} />
        <Skeleton height={110} />
        <Skeleton height={110} />
      </div>
    );
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!tasks?.length)
    return (
      <Card>
        <EmptyState
          title="Задач не найдено"
          description="Сбросьте фильтры или измените поисковый запрос."
        />
      </Card>
    );
  return (
    <div className={styles.taskGrid}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          actions={
            <CompleteTaskButton taskId={task.id} completed={task.status === 'completed'} compact />
          }
        />
      ))}
    </div>
  );
}
