import { CalendarDays, Layers3, UserRound } from 'lucide-react';
import type { Task } from '@/shared/types/domain';
import { formatDate } from '@/shared/lib/date';
import { assigneeRoleLabels, formatUserName } from '@/shared/lib/user';
import { Card } from '@/shared/ui';
import styles from '@/pages/page.module.css';

const iconStyle = { verticalAlign: 'middle', marginRight: 4 } as const;

export function TaskDetailsCard({ task, stageTitle }: { task: Task; stageTitle?: string }) {
  return (
    <Card className={styles.sideCard}>
      <h3>Детали задачи</h3>
      <div className={styles.keyValue}>
        <div>
          <span>Дедлайн</span>
          <strong>
            <CalendarDays size={14} style={iconStyle} />
            {formatDate(task.dueDate)}
          </strong>
        </div>
        <div>
          <span>Этап</span>
          <strong>
            <Layers3 size={14} style={iconStyle} />
            {stageTitle ?? 'Общие задачи'}
          </strong>
        </div>
        <div>
          <span>{task.assigneeRole ? assigneeRoleLabels[task.assigneeRole] : 'Ответственный'}</span>
          <strong>
            <UserRound size={14} style={iconStyle} />
            {formatUserName(task.assignee)}
          </strong>
        </div>
      </div>
    </Card>
  );
}
