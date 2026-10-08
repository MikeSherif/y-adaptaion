import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toDepartmentOption, useDepartmentsQuery } from '@/entities/department';
import type { User } from '@/shared/types/domain';
import { daysBetween } from '@/shared/lib/date';
import { selectableOptions } from '@/shared/lib/options';
import { Button, DatePicker, Input, Select } from '@/shared/ui';
import {
  employeeProfileSchema,
  toEmployeeProfileValues,
  type EmployeeProfileValues,
} from '../model/schema';
import { useUpdateEmployee } from '../model/useUpdateEmployee';
import pageStyles from '@/pages/page.module.css';

function shiftHint(from: string, to: string) {
  const days = daysBetween(from, to);
  return `Сроки открытых задач сдвинутся на ${days > 0 ? '+' : '−'}${Math.abs(days)} дн.`;
}

export function EmployeeProfileForm({ user }: { user: User }) {
  const update = useUpdateEmployee(user.id);
  const { data: departments } = useDepartmentsQuery();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<EmployeeProfileValues>({
    resolver: zodResolver(employeeProfileSchema),
    values: toEmployeeProfileValues(user),
  });
  const startDate = watch('startDate');

  return (
    <form onSubmit={handleSubmit((values) => update.mutate(values))} noValidate>
      <h2>Данные сотрудника</h2>
      <p className={pageStyles.panelLead}>
        Сотрудник получит уведомление при смене должности, отдела или даты выхода.
      </p>
      <div className={pageStyles.formGrid}>
        <Input label="Имя" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Фамилия" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Должность" error={errors.position?.message} {...register('position')} />
        <Select
          label="Отдел"
          value={watch('departmentId')}
          options={selectableOptions(departments, user.department.id, toDepartmentOption)}
          onChange={(departmentId) => setValue('departmentId', departmentId, { shouldDirty: true })}
          error={errors.departmentId?.message}
        />
        <div className={pageStyles.formStack}>
          <DatePicker
            label="Дата выхода"
            value={startDate}
            onChange={(value) => setValue('startDate', value, { shouldDirty: true, shouldValidate: true })}
            error={errors.startDate?.message}
          />
          {startDate !== user.startDate && (
            <small className={pageStyles.fieldHint}>{shiftHint(user.startDate, startDate)}</small>
          )}
        </div>
      </div>
      {update.error && <p className={pageStyles.formError}>{update.error.message}</p>}
      <div className={pageStyles.formActions}>
        <Button type="submit" variant="secondary" disabled={!isDirty} loading={update.isPending}>
          Сохранить данные
        </Button>
      </div>
    </form>
  );
}
