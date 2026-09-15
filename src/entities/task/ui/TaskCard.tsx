import { CalendarDays, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Task } from '@/shared/types/domain';
import { relativeDate } from '@/shared/lib/date';
import { Card } from '@/shared/ui';
import { TaskPriorityBadge, TaskStatusBadge } from './TaskStatusBadge';
import styles from './TaskCard.module.css';
export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  return (
    <Card className={styles.card}>
      <Link to="/tasks/$taskId" params={{ taskId: task.id }} className={styles.link}>
        <div className={styles.top}>
          <span className={task.status === 'completed' ? styles.doneIcon : styles.icon}>
            {task.status === 'completed' ? <CheckCircle2 size={18} /> : <CalendarDays size={18} />}
          </span>
          <div className={styles.copy}>
            <h3>{task.title}</h3>
            {!compact && task.description && <p>{task.description}</p>}
          </div>
          <ChevronRight size={18} className={styles.chevron} />
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
      </Link>
    </Card>
  );
}
