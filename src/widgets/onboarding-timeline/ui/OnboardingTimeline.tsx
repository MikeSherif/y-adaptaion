import { Check, LockKeyhole, MoveRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { OnboardingStage } from '@/shared/types/domain';
import { Progress } from '@/shared/ui';
import { formatShortDate } from '@/shared/lib/date';
import styles from './OnboardingTimeline.module.css';
export function OnboardingTimeline({
  stages,
  interactive = true,
}: {
  stages: OnboardingStage[];
  interactive?: boolean;
}) {
  return (
    <ol className={styles.timeline}>
      {stages.map((stage) => (
        <li className={styles.row} key={stage.id}>
          <span
            className={
              stage.status === 'completed'
                ? styles.stepComplete
                : stage.status === 'current'
                  ? styles.stepCurrent
                  : styles.stepLocked
            }
          >
            {stage.status === 'completed' ? (
              <Check size={16} />
            ) : stage.status === 'locked' ? (
              <LockKeyhole size={14} />
            ) : (
              stage.order
            )}
          </span>
          <div className={stage.status === 'current' ? styles.current : styles.content}>
            <div className={styles.top}>
              <div>
                <span>Этап {stage.order}</span>
                <h3>{stage.title}</h3>
              </div>
              {interactive && stage.status !== 'locked' && (
                <Link to="/onboarding/$stageId" params={{ stageId: stage.id }}>
                  Открыть <MoveRight size={15} />
                </Link>
              )}
            </div>
            <p>{stage.description}</p>
            <div className={styles.footer}>
              {stage.status !== 'locked' && (
                <div>
                  <Progress value={stage.progress} />
                  <small>
                    {stage.progress}% выполнено ·{' '}
                    {stage.tasks.filter((task) => task.status === 'completed').length}/
                    {stage.tasks.length} задач
                  </small>
                </div>
              )}
              <time>
                {formatShortDate(stage.startDate)} — {formatShortDate(stage.dueDate)}
              </time>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
