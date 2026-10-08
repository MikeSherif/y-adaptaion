import { ArrowLeft, MoveRight } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { useOnboardingQuery } from '@/entities/onboarding';
import { TaskCard } from '@/entities/task';
import { useEmployeesQuery, useUserByIdQuery } from '@/entities/user';
import {
  AddEmployeeTaskForm,
  RemoveEmployeeTaskButton,
  RescheduleTaskField,
} from '@/features/manage-employee-task';
import { EmployeeTeamForm } from '@/features/manage-employee-team';
import { EmployeeProfileForm } from '@/features/edit-employee-profile';
import { RemindEmployeeButton } from '@/features/remind-employee';
import type { Task } from '@/shared/types/domain';
import { Avatar, Card, ErrorState, Skeleton } from '@/shared/ui';
import { buttonClass } from '@/shared/ui/buttonClass';
import { formatDate } from '@/shared/lib/date';
import { formatUserName } from '@/shared/lib/user';
import { EmployeeActivity } from '@/widgets/employee-activity';
import { OnboardingProgress } from '@/widgets/onboarding-progress';
import { OnboardingTimeline } from '@/widgets/onboarding-timeline';
import styles from '@/pages/page.module.css';

function PlanTasksSection({
  title,
  description,
  tasks,
  userId,
}: {
  title: string;
  description: string;
  tasks: Task[];
  userId: string;
}) {
  if (tasks.length === 0) return null;
  return (
    <Card className={styles.panel}>
      <h2>{title}</h2>
      <p className={styles.panelLead}>{description}</p>
      <div className={styles.stageTasks}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            compact
            interactive={false}
            actions={
              <div className={styles.taskPlanActions}>
                <RescheduleTaskField taskId={task.id} dueDate={task.dueDate} />
                <div className={styles.inlineActions}>
                  <Link
                    to="/admin/employees/$userId/tasks/$taskId"
                    params={{ userId, taskId: task.id }}
                    className={buttonClass('ghost')}
                  >
                    Открыть <MoveRight size={15} />
                  </Link>
                  <RemoveEmployeeTaskButton taskId={task.id} />
                </div>
              </div>
            }
          />
        ))}
      </div>
    </Card>
  );
}

export function AdminEmployeePage() {
  const { userId } = useParams({ from: '/admin/employees/$userId' });
  const { data: user, isLoading, isError, refetch } = useUserByIdQuery(userId);
  const { data: onboarding } = useOnboardingQuery(userId);
  const { data: employees } = useEmployeesQuery();
  const summary = employees?.find((item) => item.user.id === userId);
  const allTasks = onboarding?.stages.flatMap((stage) => stage.tasks) ?? [];
  const overdueTasks = allTasks.filter((task) => task.status === 'overdue');
  const openTasks = allTasks.filter(
    (task) => task.status !== 'completed' && task.status !== 'overdue',
  );

  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={70} />
        <Skeleton height={220} />
        <Skeleton height={360} />
      </div>
    );
  if (isError || !user)
    return <ErrorState title="Сотрудник не найден" onRetry={() => void refetch()} />;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/admin/employees">
          <ArrowLeft size={15} />
          Сотрудники
        </Link>
        <span>/</span>
        <span>{formatUserName(user)}</span>
      </div>
      <Card className={styles.employeeHero}>
        <Avatar user={user} large />
        <div>
          <p className={styles.eyebrow}>{user.department.name}</p>
          <h1>{formatUserName(user)}</h1>
          <p>
            {user.position}
            <br />
            В команде с {formatDate(user.startDate)}
          </p>
        </div>
        <div className={styles.employeeHeroActions}>
          <RemindEmployeeButton
            userId={userId}
            overdueCount={overdueTasks.length}
            lastRemindedAt={summary?.lastRemindedAt}
          />
        </div>
      </Card>
      <Card className={styles.panel}>
        <EmployeeProfileForm user={user} />
      </Card>
      <Card className={styles.panel}>
        <EmployeeTeamForm key={`${user.manager?.id}-${user.mentor?.id}`} user={user} />
      </Card>
      {onboarding && (
        <Card className={styles.panel}>
          <AddEmployeeTaskForm userId={userId} stages={onboarding.stages} />
        </Card>
      )}
      <PlanTasksSection
        title="Просроченные задачи"
        description="Можно сдвинуть срок или открыть задачу. Завершать чужие задачи нельзя."
        tasks={overdueTasks}
        userId={userId}
      />
      <PlanTasksSection
        title="Незакрытые задачи"
        description="Задачи без просрочки, в том числе с будущих этапов."
        tasks={openTasks}
        userId={userId}
      />
      <div className={styles.twoCol}>
        <Card className={styles.panel}>
          <h2>План адаптации</h2>
          <p className={styles.panelLead}>
            Просмотр чужого плана — завершать задачи сотрудника нельзя.
          </p>
          {onboarding ? (
            <OnboardingTimeline stages={onboarding.stages} interactive={false} />
          ) : (
            <Skeleton height={280} />
          )}
        </Card>
        <div className={styles.page}>
          <OnboardingProgress userId={userId} showPlanLink={false} />
          <EmployeeActivity userId={userId} />
        </div>
      </div>
    </div>
  );
}
