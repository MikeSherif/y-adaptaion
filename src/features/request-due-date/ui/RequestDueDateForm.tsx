import { useEffect, useState } from 'react';
import type { Task } from '@/shared/types/domain';
import { formatDate, todayIso } from '@/shared/lib/date';
import { Button, Card, DatePicker, Textarea } from '@/shared/ui';
import { useRequestDueDate } from '../model/useRequestDueDate';
import styles from '@/pages/page.module.css';

export function RequestDueDateForm({ task }: { task: Task }) {
  const request = useRequestDueDate();
  const [dueDate, setDueDate] = useState(task.dueRequest?.dueDate ?? task.dueDate ?? todayIso());
  const [comment, setComment] = useState(task.dueRequest?.comment ?? '');

  useEffect(() => {
    setDueDate(task.dueRequest?.dueDate ?? task.dueDate ?? todayIso());
    setComment(task.dueRequest?.comment ?? '');
  }, [task.dueDate, task.dueRequest, task.id]);

  if (task.status === 'completed') return null;

  return (
    <Card className={styles.sideCard}>
      <h3>Сдвинуть срок</h3>
      <p className={styles.panelLead}>HR увидит просьбу и решит, менять срок или нет.</p>
      {task.dueRequest && (
        <p className={styles.notice}>Ожидает решения: {formatDate(task.dueRequest.dueDate)}</p>
      )}
      <div className={styles.formStack}>
        <DatePicker label="Новый срок" min={todayIso()} value={dueDate} onChange={setDueDate} />
        <label className={styles.fieldLabel}>
          Комментарий
          <Textarea value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>
        {request.error && <p className={styles.formError}>{request.error.message}</p>}
        <Button
          type="button"
          loading={request.isPending}
          onClick={() => request.mutate({ taskId: task.id, payload: { dueDate, comment } })}
        >
          {task.dueRequest ? 'Обновить просьбу' : 'Попросить сдвинуть'}
        </Button>
      </div>
    </Card>
  );
}
