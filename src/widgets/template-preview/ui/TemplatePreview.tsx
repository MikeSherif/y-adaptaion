import { Paperclip, UserRound } from 'lucide-react';
import { TaskPriorityBadge } from '@/entities/task';
import { countTemplateTasks, templateDuration } from '@/entities/template';
import type { OnboardingTemplate } from '@/shared/types/domain';
import { assigneeRoleLabels } from '@/shared/lib/user';
import styles from './TemplatePreview.module.css';

const dayLabel = (offset: number) => `День ${offset + 1}`;

export function TemplatePreview({
  template,
  compact = false,
}: {
  template: OnboardingTemplate;
  compact?: boolean;
}) {
  return (
    <div className={styles.preview}>
      <p className={styles.summary}>
        Этапов: {template.stages.length} · задач: {countTemplateTasks(template)} · длительность:{' '}
        {templateDuration(template)} дн.
      </p>
      <ol className={styles.stages}>
        {template.stages.map((stage) => (
          <li key={stage.id} className={styles.stage}>
            <div className={styles.stageHead}>
              <span className={styles.order}>{stage.order}</span>
              <div>
                <h3>{stage.title}</h3>
                <small>
                  {dayLabel(stage.startOffset)} — {dayLabel(stage.endOffset)}
                </small>
              </div>
            </div>
            {!compact && stage.description && <p className={styles.stageDesc}>{stage.description}</p>}
            <ul className={styles.tasks}>
              {stage.tasks.map((task) => (
                <li key={task.id} className={styles.task}>
                  <span className={styles.day}>{dayLabel(task.dayOffset)}</span>
                  <span className={styles.title}>{task.title}</span>
                  {!compact && (
                    <span className={styles.meta}>
                      <TaskPriorityBadge priority={task.priority} />
                      {task.assignee && (
                        <span className={styles.tag}>
                          <UserRound size={13} />
                          {assigneeRoleLabels[task.assignee]}
                        </span>
                      )}
                      {task.materialIds?.length ? (
                        <span className={styles.tag}>
                          <Paperclip size={13} />
                          {task.materialIds.length}
                        </span>
                      ) : null}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
