import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { MoveRight, UserPlus } from 'lucide-react';
import { useEmployeesQuery } from '@/entities/user';
import { RemindEmployeeButton } from '@/features/remind-employee';
import { Card, EmptyState, ErrorState, Progress, Skeleton } from '@/shared/ui';
import { buttonClass } from '@/shared/ui/buttonClass';
import { filterEmployees, formatUserName, summarizeEmployees } from '@/shared/lib/user';
import { EmployeeFilters } from '@/widgets/employee-filters';
import { EmployeesOverview } from '@/widgets/employees-overview';
import styles from '@/pages/page.module.css';

export function AdminEmployeesPage() {
  const filters = useSearch({ from: '/admin/employees' });
  const navigate = useNavigate({ from: '/admin/employees' });
  const { data, isLoading, isError, refetch } = useEmployeesQuery();
  const setFilters = (value: Partial<typeof filters>) => {
    void navigate({ search: (previous) => ({ ...previous, ...value }) });
  };

  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={70} />
        <Skeleton height={90} />
        <Skeleton height={180} />
      </div>
    );
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;

  const stats = summarizeEmployees(data);
  const visible = filterEmployees(data, filters);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Кабинет HR</p>
          <h1>Сотрудники</h1>
          <p>Новички на адаптации и их текущий прогресс.</p>
        </div>
        <Link to="/admin/employees/new" className={buttonClass()}>
          <UserPlus size={16} />
          Добавить сотрудника
        </Link>
      </div>
      <EmployeesOverview {...stats} />
      <EmployeeFilters filters={filters} employees={data} onChange={setFilters} />
      {visible.length === 0 ? (
        <EmptyState
          title="Никого не нашли"
          description="Измените поиск или фильтры, чтобы увидеть сотрудников."
        />
      ) : (
        <div className={styles.employeeGrid}>
          {visible.map(({ user, progress, currentStageTitle, overdueCount, openQuestions, lastRemindedAt }) => (
            <Card key={user.id} className={styles.employeeCard}>
              <Link
                to="/admin/employees/$userId"
                params={{ userId: user.id }}
                className={styles.employeeLink}
              >
                <div className={styles.employeeTop}>
                  <div className={styles.employeeTitle}>
                    <h2>{formatUserName(user)}</h2>
                    <p>{user.position}</p>
                  </div>
                  <span>
                    Открыть <MoveRight size={15} />
                  </span>
                </div>
                <p className={styles.employeeDept}>{user.department.name}</p>
                <Progress value={progress} />
                <div className={styles.employeeMeta}>
                  <strong>{progress}%</strong>
                  <span>{currentStageTitle ?? 'Адаптация завершена'}</span>
                </div>
                {(overdueCount > 0 || openQuestions > 0) && (
                  <div className={styles.badgeRow}>
                    {overdueCount > 0 && (
                      <span className={styles.employeeBadge}>Просрочено · {overdueCount}</span>
                    )}
                    {openQuestions > 0 && (
                      <span className={styles.employeeBadgeInfo}>Вопросы · {openQuestions}</span>
                    )}
                  </div>
                )}
              </Link>
              {overdueCount > 0 && (
                <div className={styles.employeeActions}>
                  <RemindEmployeeButton
                    userId={user.id}
                    overdueCount={overdueCount}
                    lastRemindedAt={lastRemindedAt}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
