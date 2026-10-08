import type { ReactNode } from 'react';
import { CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Task } from '@/shared/types/domain';
import { relativeDate } from '@/shared/lib/date';
import { Card } from '@/shared/ui';
import { TaskPriorityBadge, TaskStatusBadge } from './TaskStatusBadge';
import styles from './TaskCard.module.css';
export function TaskCard({
  task,
  compact = false,
  interactive = true,
  actions,
}: {
  task: Task;
  compact?: boolean;
  interactive?: boolean;
  actions?: ReactNode;
}) {
  const body = (
    <>
      <div className={styles.top}>
        <span className={task.status === 'completed' ? styles.doneIcon : styles.icon}>
          {task.status === 'completed' ? <CheckCircle2 size={18} /> : <CalendarDays size={18} />}
        </span>
        <div className={styles.copy}>
          <h3>{task.title}</h3>
          {!compact && task.description && <p>{task.description}</p>}
        </div>
        {interactive && <ChevronRight size={18} className={styles.chevron} />}
      </div>
      <div className={styles.meta}>
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span className={styles.date}>
            {task.status === 'completed' ? 'Выполнено' : relativeDate(task.dueDate)}
          </span>
        )}
      </div>
    </>
  );
  return (
    <Card className={styles.card}>
      {interactive ? (
        <Link to="/tasks/$taskId" params={{ taskId: task.id }} className={styles.link}>
          {body}
        </Link>
      ) : (
        <div className={styles.link}>{body}</div>
      )}
      {actions && (
        <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
          {actions}
        </div>
      )}
    </Card>
  );
}
