import type { Task } from '@/shared/types/domain';
import { formatDate } from '@/shared/lib/date';
import { Button } from '@/shared/ui';
import { useResolveDueDateRequest } from '../model/useResolveDueDateRequest';
import styles from '@/pages/page.module.css';

export function DueRequestActions({ task }: { task: Task }) {
  const resolve = useResolveDueDateRequest();
  if (!task.dueRequest || task.status === 'completed') return null;

  return (
    <div className={styles.formStack}>
      <p className={styles.notice}>
        Просит срок {formatDate(task.dueRequest.dueDate)}: {task.dueRequest.comment}
      </p>
      <div className={styles.inlineActions}>
        <Button
          type="button"
          loading={resolve.isPending && resolve.variables?.decision === 'approved'}
          onClick={() => resolve.mutate({ taskId: task.id, decision: 'approved' })}
        >
          Принять
        </Button>
        <Button
          type="button"
          variant="ghost"
          loading={resolve.isPending && resolve.variables?.decision === 'rejected'}
          onClick={() => resolve.mutate({ taskId: task.id, decision: 'rejected' })}
        >
          Отклонить
        </Button>
      </div>
      {resolve.error && <p className={styles.formError}>{resolve.error.message}</p>}
    </div>
  );
}
