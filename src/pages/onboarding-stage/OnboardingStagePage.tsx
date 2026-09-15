import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { useStageQuery } from '@/entities/onboarding-stage';
import { TaskCard } from '@/entities/task';
import { useMaterialsQuery } from '@/entities/material';
import { MaterialCard } from '@/entities/material';
import { useMarkMaterialAsRead } from '@/features/mark-material-as-read';
import { Card, ErrorState, Progress, Skeleton } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import styles from '@/pages/page.module.css';
export function OnboardingStagePage() {
  const { stageId } = useParams({ from: '/onboarding/$stageId' });
  const { data: stage, isLoading, isError, refetch } = useStageQuery(stageId);
  const { data: materials } = useMaterialsQuery();
  const markRead = useMarkMaterialAsRead();
  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={22} />
        <Skeleton height={240} />
        <Skeleton height={300} />
      </div>
    );
  if (isError || !stage)
    return <ErrorState title="Не удалось открыть этап" onRetry={() => void refetch()} />;
  const related =
    materials
      ?.filter((material) => stage.tasks.some((task) => task.materialIds?.includes(material.id)))
      .slice(0, 3) ?? [];
  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/onboarding">
          <ArrowLeft size={15} />
          Адаптация
        </Link>
        <span>/</span>
        <span>{stage.title}</span>
      </div>
      <Card className={styles.detailHero}>
        <p className={styles.eyebrow}>Этап {stage.order}</p>
        <h1>{stage.title}</h1>
        <p>{stage.description}</p>
        <div className={styles.stageLead}>
          <div>
            <Progress value={stage.progress} />
            <small style={{ display: 'block', marginTop: 8, color: 'var(--color-text-secondary)' }}>
              {stage.progress}% выполнено
            </small>
          </div>
        </div>
      </Card>
      <div className={styles.twoCol}>
        <Card className={styles.panel}>
          <h2>Задачи этапа</h2>
          <div className={styles.stageTasks}>
            {stage.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </Card>
        <div className={styles.page}>
          <Card className={styles.sideCard}>
            <h3>О этапе</h3>
            <div className={styles.keyValue}>
              <div>
                <span>Дедлайн</span>
                <strong>
                  <CalendarDays size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {formatDate(stage.dueDate)}
                </strong>
              </div>
              <div>
                <span>Задач</span>
                <strong>{stage.tasks.length}</strong>
              </div>
              <div>
                <span>Ответственный</span>
                <strong>
                  <UserRound size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Мария Соколова
                </strong>
              </div>
            </div>
          </Card>
          {related.length > 0 && (
            <Card className={styles.panel}>
              <h2 style={{ fontSize: 15 }}>Материалы</h2>
              <div className={styles.stageTasks}>
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
      </div>
    </div>
  );
}
