import { ArrowUpRight, CheckCircle2, Flag, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useOnboardingQuery } from '@/entities/onboarding';
import { useUserQuery } from '@/entities/user';
import { Card, Progress, Skeleton } from '@/shared/ui';
import styles from './DashboardOverview.module.css';
export function DashboardOverview() {
  const { data: user } = useUserQuery();
  const { data: onboarding, isLoading } = useOnboardingQuery();
  if (isLoading || !onboarding)
    return (
      <Card className={styles.hero}>
        <Skeleton height={30} />
        <Skeleton height={10} />
      </Card>
    );
  const current = onboarding.stages.find((stage) => stage.status === 'current');
  const tasksDone = onboarding.stages
    .flatMap((stage) => stage.tasks)
    .filter((task) => task.status === 'completed').length;
  const total = onboarding.stages.flatMap((stage) => stage.tasks).length;
  return (
    <Card className={styles.hero}>
      <div className={styles.main}>
        <span className={styles.kicker}>
          <Sparkles size={15} />
          Ваш путь в команде
        </span>
        <h1>Рады видеть, {user?.firstName ?? 'Алина'}!</h1>
        <p>Вы уверенно проходите адаптацию. Следующий шаг — глубже познакомиться с продуктом.</p>
        <div className={styles.progressRow}>
          <div>
            <strong>{onboarding.progress}%</strong>
            <span>общий прогресс</span>
          </div>
          <Progress value={onboarding.progress} />
          <small>
            {tasksDone} из {total} задач
          </small>
        </div>
        <Link to="/onboarding" className={styles.link}>
          Открыть план адаптации <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className={styles.stage}>
        <Flag size={24} />
        <span>Текущий этап</span>
        <strong>{current?.title ?? 'Адаптация завершена'}</strong>
        <small>
          {current?.dueDate
            ? `до ${new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(current.dueDate))}`
            : 'Все этапы пройдены'}
        </small>
        <CheckCircle2 size={22} />
      </div>
    </Card>
  );
}
