import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { MaterialCard, useMaterialsByIds } from '@/entities/material';
import { useOnboardingQuery } from '@/entities/onboarding';
import { TaskDetailsCard, TaskPriorityBadge, TaskStatusBadge, useTaskQuery } from '@/entities/task';
import { useUserByIdQuery } from '@/entities/user';
import { EditEmployeeTaskForm, RemoveEmployeeTaskButton } from '@/features/manage-employee-task';
import { formatUserName } from '@/shared/lib/user';
import { Card, ErrorState, Skeleton } from '@/shared/ui';
import { TaskDiscussion } from '@/widgets/task-discussion';
import styles from '@/pages/page.module.css';

export function AdminEmployeeTaskPage() {
  const { userId, taskId } = useParams({ from: '/admin/employees/$userId/tasks/$taskId' });
  const navigate = useNavigate();
  const { data: task, isLoading, isError, refetch } = useTaskQuery(taskId);
  const { data: user } = useUserByIdQuery(userId);
  const { data: onboarding } = useOnboardingQuery(userId);
  const { data: related = [] } = useMaterialsByIds(task?.materialIds);

  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={22} />
        <Skeleton height={250} />
      </div>
    );
  if (isError || !task || task.userId !== userId)
    return <ErrorState title="Задача не найдена" onRetry={() => void refetch()} />;

  const stage = onboarding?.stages.find((item) => item.id === task.stageId);  const editable = task.status !== 'completed';
  const backToEmployee = () => void navigate({ to: '/admin/employees/$userId', params: { userId } });

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/admin/employees/$userId" params={{ userId }}>
          <ArrowLeft size={15} />
          {user ? formatUserName(user) : 'Сотрудник'}
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
            {task.description && <p>{task.description}</p>}
          </Card>
          {editable ? (
            <Card className={styles.panel}>
              <EditEmployeeTaskForm task={task} />
            </Card>
          ) : (
            related.length > 0 && (
              <Card className={styles.panel}>
                <h2>Связанные материалы</h2>
                <div className={styles.stageTasks}>
                  {related.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              </Card>
            )
          )}
          <TaskDiscussion
            taskId={task.id}
            emptyText="Сотрудник ещё не писал по этой задаче."
            placeholder="Ответьте сотруднику"
          />
        </div>
        <div className={styles.page}>
          <TaskDetailsCard task={task} stageTitle={stage?.title} />
          {editable && (
            <Card className={styles.sideCard}>
              <h3>Снять задачу</h3>
              <p className={styles.panelLead}>Задача и переписка по ней исчезнут из плана.</p>
              <RemoveEmployeeTaskButton taskId={task.id} onRemoved={backToEmployee} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
