import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { Task } from '@/shared/types/domain';
import { Button } from '@/shared/ui';
import { taskFieldsSchema, type TaskFieldsValues } from '../model/schema';
import { useUpdateEmployeeTask } from '../model/useManageEmployeeTask';
import { TaskFormFields } from './TaskFormFields';
import pageStyles from '@/pages/page.module.css';

const toValues = (task: Task): TaskFieldsValues => ({
  title: task.title,
  dueDate: task.dueDate ?? '',
  priority: task.priority,
  description: task.description ?? '',
  materialIds: task.materialIds ?? [],
});

export function EditEmployeeTaskForm({ task }: { task: Task }) {
  const update = useUpdateEmployeeTask();
  const form = useForm<TaskFieldsValues>({
    resolver: zodResolver(taskFieldsSchema),
    values: toValues(task),
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((patch) => update.mutate({ taskId: task.id, patch }))}
        noValidate
      >
        <h2>Редактировать задачу</h2>
        <p className={pageStyles.panelLead}>Сотрудник получит уведомление об изменениях.</p>
        <TaskFormFields />
        {update.error && <p className={pageStyles.formError}>{update.error.message}</p>}
        <div className={pageStyles.formActions}>
          <Button type="submit" disabled={!form.formState.isDirty} loading={update.isPending}>
            Сохранить изменения
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
