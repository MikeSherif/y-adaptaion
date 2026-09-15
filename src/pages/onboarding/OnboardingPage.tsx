import { useOnboardingQuery } from '@/entities/onboarding';
import { Card, ErrorState, Progress, Skeleton } from '@/shared/ui';
import { OnboardingTimeline } from '@/widgets/onboarding-timeline';
import { formatDate } from '@/shared/lib/date';
import styles from '@/pages/page.module.css';
export function OnboardingPage() {
  const { data, isLoading, isError, refetch } = useOnboardingQuery();
  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={70} />
        <Skeleton height={420} />
      </div>
    );
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const current = data.stages.find((stage) => stage.status === 'current');
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Ваш маршрут</p>
          <h1>Моя адаптация</h1>
          <p>Проходите этапы последовательно — мы отмечаем прогресс автоматически.</p>
        </div>
      </div>
      <Card className={styles.detailHero}>
        <div className={styles.stageLead}>
          <div>
            <h2>{data.progress}% пройдено</h2>
            <p>
              Следующий этап: <strong>{current?.title ?? 'адаптация завершена'}</strong>
            </p>
            <Progress value={data.progress} />
          </div>
          <p>
            Период адаптации
            <br />
            <strong>
              {formatDate(data.startDate)} — {formatDate(data.endDate)}
            </strong>
          </p>
        </div>
      </Card>
      <Card className={styles.panel}>
        <h2>Этапы адаптации</h2>
        <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          Открывайте активные этапы, изучайте материалы и выполняйте задачи.
        </p>
        <div style={{ marginTop: 22 }}>
          <OnboardingTimeline stages={data.stages} />
        </div>
      </Card>
    </div>
  );
}
