import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { MaterialPicker } from '@/entities/material';
import { taskPriorityOptions } from '@/entities/task';
import { DatePicker, Input, Select, Textarea } from '@/shared/ui';
import type { TaskFieldsValues } from '../model/schema';
import pageStyles from '@/pages/page.module.css';

export function TaskFormFields({ extra }: { extra?: ReactNode }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TaskFieldsValues>();

  return (
    <div className={pageStyles.formStack}>
      <div className={pageStyles.formGrid}>
        <Input label="Название" error={errors.title?.message} {...register('title')} />
        <DatePicker
          label="Срок"
          value={watch('dueDate')}
          onChange={(dueDate) => setValue('dueDate', dueDate, { shouldDirty: true, shouldValidate: true })}
          error={errors.dueDate?.message}
        />
        {extra}
        <Select
          label="Приоритет"
          value={watch('priority')}
          options={taskPriorityOptions}
          onChange={(priority) => setValue('priority', priority, { shouldDirty: true })}
        />
      </div>
      <label className={pageStyles.fieldLabel}>
        Описание
        <Textarea {...register('description')} />
      </label>
      <MaterialPicker
        value={watch('materialIds')}
        onChange={(materialIds) => setValue('materialIds', materialIds, { shouldDirty: true })}
      />
    </div>
  );
}
