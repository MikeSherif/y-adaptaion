import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { OnboardingStage } from '@/shared/types/domain';
import { addDays, todayIso } from '@/shared/lib/date';
import { Button, Select } from '@/shared/ui';
import { createEmployeeTaskSchema, type CreateEmployeeTaskValues } from '../model/schema';
import { useCreateEmployeeTask } from '../model/useManageEmployeeTask';
import { TaskFormFields } from './TaskFormFields';
import pageStyles from '@/pages/page.module.css';

const emptyValues = (stageId: string): CreateEmployeeTaskValues => ({
  title: '',
  stageId,
  dueDate: addDays(todayIso(), 7),
  priority: 'medium',
  description: '',
  materialIds: [],
});

export function AddEmployeeTaskForm({
  userId,
  stages,
}: {
  userId: string;
  stages: OnboardingStage[];
}) {
  const create = useCreateEmployeeTask();
  const defaultStageId = stages.find((stage) => stage.status === 'current')?.id ?? stages[0]?.id ?? '';
  const form = useForm<CreateEmployeeTaskValues>({
    resolver: zodResolver(createEmployeeTaskSchema),
    defaultValues: emptyValues(defaultStageId),
  });
  const { handleSubmit, watch, setValue, reset, formState } = form;

  useEffect(() => {
    if (defaultStageId) setValue('stageId', defaultStageId);
  }, [defaultStageId, setValue]);

  const save = async (values: CreateEmployeeTaskValues) => {
    await create.mutateAsync({ userId, ...values });
    reset(emptyValues(defaultStageId));
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit((values) => void save(values))} noValidate>
        <h2>Добавить задачу</h2>
        <p className={pageStyles.panelLead}>Задача появится в плане сотрудника и в его списке.</p>
        <TaskFormFields
          extra={
            <Select
              label="Этап"
              value={watch('stageId')}
              options={stages.map((stage) => ({ value: stage.id, label: stage.title }))}
              onChange={(stageId) => setValue('stageId', stageId, { shouldValidate: true })}
              error={formState.errors.stageId?.message}
            />
          }
        />
        <div className={pageStyles.formActions}>
          <Button type="submit" loading={create.isPending}>
            Добавить в план
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
