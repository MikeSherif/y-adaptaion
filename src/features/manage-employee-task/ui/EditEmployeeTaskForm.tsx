import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { OnboardingStage, Task } from '@/shared/types/domain';
import { Button, Select } from '@/shared/ui';
import { editEmployeeTaskSchema, type EditEmployeeTaskValues } from '../model/schema';
import { useUpdateEmployeeTask } from '../model/useManageEmployeeTask';
import { TaskFormFields } from './TaskFormFields';
import pageStyles from '@/pages/page.module.css';

const toValues = (task: Task): EditEmployeeTaskValues => ({
  title: task.title,
  dueDate: task.dueDate ?? '',
  priority: task.priority,
  description: task.description ?? '',
  materialIds: task.materialIds ?? [],
  stageId: task.stageId ?? '',
});

export function EditEmployeeTaskForm({
  task,
  stages,
}: {
  task: Task;
  stages: OnboardingStage[];
}) {
  const update = useUpdateEmployeeTask();
  const form = useForm<EditEmployeeTaskValues>({
    resolver: zodResolver(editEmployeeTaskSchema),
    values: toValues(task),
  });
  const { watch, setValue, formState } = form;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((patch) => update.mutate({ taskId: task.id, patch }))}
        noValidate
      >
        <h2>Редактировать задачу</h2>
        <p className={pageStyles.panelLead}>Сотрудник получит уведомление об изменениях.</p>
        <TaskFormFields
          extra={
            <Select
              label="Этап"
              value={watch('stageId')}
              options={stages.map((stage) => ({ value: stage.id, label: stage.title }))}
              onChange={(stageId) =>
                setValue('stageId', stageId, { shouldDirty: true, shouldValidate: true })
              }
              error={formState.errors.stageId?.message}
            />
          }
        />
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
