import { Award, CalendarDays } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useOnboardingQuery } from '@/entities/onboarding';
import { Card, ErrorState, Progress, Skeleton } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import styles from './OnboardingProgress.module.css';
export function OnboardingProgress({
  userId,
  showPlanLink = true,
}: {
  userId?: string;
  showPlanLink?: boolean;
}) {
  const { data, isLoading, isError, refetch } = useOnboardingQuery(userId);
  if (isLoading)
    return (
      <Card className={styles.card}>
        <Skeleton height={22} />
        <Skeleton height={8} />
        <Skeleton height={42} />
      </Card>
    );
  if (isError || !data)
    return (
      <Card className={styles.card}>
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    );
  const completed = data.stages.filter((stage) => stage.status === 'completed').length;
  return (
    <Card className={styles.card}>
      <div className={styles.title}>
        <div>
          <span>Адаптация</span>
          <h2>{userId ? 'Прогресс адаптации' : 'Ваш прогресс'}</h2>
        </div>
        <Award size={22} />
      </div>
      {showPlanLink && (
        <Link to="/onboarding" className={styles.link}>
          Открыть план
        </Link>
      )}
      <div className={styles.number}>
        {data.progress}
        <small>%</small>
      </div>
      <Progress value={data.progress} />
      <div className={styles.stats}>
        <span>
          {completed} из {data.stages.length} этапов
        </span>
        <span>
          <CalendarDays size={14} />
          {formatDate(data.endDate)}
        </span>
      </div>
    </Card>
  );
}
