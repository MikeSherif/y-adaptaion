import { useEffect, useState } from 'react';
import { Button, DatePicker } from '@/shared/ui';
import { useUpdateEmployeeTask } from '../model/useManageEmployeeTask';
import styles from './RescheduleTaskField.module.css';

export function RescheduleTaskField({ taskId, dueDate }: { taskId: string; dueDate?: string }) {
  const mutation = useUpdateEmployeeTask();
  const [value, setValue] = useState(dueDate?.slice(0, 10) ?? '');
  useEffect(() => {
    setValue(dueDate?.slice(0, 10) ?? '');
  }, [dueDate]);
  const unchanged = value === (dueDate?.slice(0, 10) ?? '');
  return (
    <form
      className={styles.row}
      onClick={(event) => event.stopPropagation()}
      onSubmit={(event) => {
        event.preventDefault();
        if (!value || unchanged) return;
        void mutation.mutateAsync({ taskId, patch: { dueDate: value } });
      }}
    >
      <div className={styles.field}>
        <DatePicker aria-label="Новый срок" value={value} onChange={setValue} />
      </div>
      <Button type="submit" variant="secondary" loading={mutation.isPending} disabled={!value || unchanged}>
        Сдвинуть срок
      </Button>
    </form>
  );
}
