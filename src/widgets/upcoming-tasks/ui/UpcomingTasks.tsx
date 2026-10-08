import { Link } from '@tanstack/react-router';
import { useTasksQuery } from '@/entities/task';
import { TaskCard } from '@/entities/task';
import { Card, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import styles from './UpcomingTasks.module.css';
export function UpcomingTasks() {
  const { data, isLoading, isError, refetch } = useTasksQuery({ sort: 'dueDate' });
  const upcoming = data?.filter((task) => task.status !== 'completed').slice(0, 3);
  return (
    <Card className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2>Ближайшие задачи</h2>
          <p>Чтобы двигаться в своём темпе</p>
        </div>
        <Link to="/tasks">Все задачи</Link>
      </div>
      {isLoading && (
        <div className={styles.list}>
          <Skeleton height={105} />
          <Skeleton height={105} />
        </div>
      )}
      {isError && <ErrorState onRetry={() => void refetch()} />}
      {upcoming && upcoming.length === 0 && (
        <EmptyState title="Ближайших задач нет" description="Все текущие задачи уже выполнены." />
      )}
      {upcoming && upcoming.length > 0 && (
        <div className={styles.list}>
          {upcoming.map((task) => (
            <TaskCard task={task} compact key={task.id} />
          ))}
        </div>
      )}
    </Card>
  );
}
