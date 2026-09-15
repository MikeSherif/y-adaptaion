import { ArrowLeft, CalendarDays, Layers3, UserRound } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { useTaskQuery, TaskPriorityBadge, TaskStatusBadge } from '@/entities/task';
import { useOnboardingQuery } from '@/entities/onboarding';
import { useMaterialsQuery, MaterialCard } from '@/entities/material';
import { CompleteTaskButton } from '@/features/complete-task';
import { useMarkMaterialAsRead } from '@/features/mark-material-as-read';
import { Card, ErrorState, Skeleton } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import styles from '@/pages/page.module.css';
export function TaskDetailPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' });
  const { data: task, isLoading, isError, refetch } = useTaskQuery(taskId);
  const { data: onboarding } = useOnboardingQuery();
  const { data: materials } = useMaterialsQuery();
  const markRead = useMarkMaterialAsRead();
  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={22} />
        <Skeleton height={250} />
      </div>
    );
  if (isError || !task)
    return <ErrorState title="Не удалось открыть задачу" onRetry={() => void refetch()} />;
  const stage = onboarding?.stages.find((item) => item.id === task.stageId);
  const related = materials?.filter((material) => task.materialIds?.includes(material.id)) ?? [];
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/tasks">
          <ArrowLeft size={15} />
          Задачи
        </Link>
        <span>/</span>
        <span>{task.title}</span>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.page}>
          <Card className={styles.detailHero}>
            <div className={styles.detailMeta}>
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <div style={{ marginTop: 22 }}>
              <CompleteTaskButton
                taskId={task.id}
                completed={task.status === 'completed'}
                onDone={() => void refetch()}
              />
            </div>
          </Card>
          {related.length > 0 && (
            <Card className={styles.panel}>
              <h2>Связанные материалы</h2>
              <div className={styles.materialGrid} style={{ marginTop: 16 }}>
                {related.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    onRead={(id) => markRead.mutate(id)}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
        <Card className={styles.sideCard}>
          <h3>Детали задачи</h3>
          <div className={styles.keyValue}>
            <div>
              <span>Дедлайн</span>
              <strong>
                <CalendarDays size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {formatDate(task.dueDate)}
              </strong>
            </div>
            <div>
              <span>Этап</span>
              <strong>
                <Layers3 size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {stage?.title ?? 'Общие задачи'}
              </strong>
            </div>
            <div>
              <span>Ответственный</span>
              <strong>
                <UserRound size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {task.assignee
                  ? `${task.assignee.firstName} ${task.assignee.lastName}`
                  : 'Не назначен'}
              </strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
