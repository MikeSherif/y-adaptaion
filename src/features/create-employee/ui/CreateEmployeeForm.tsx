import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toDepartmentOption, useDepartmentsQuery } from '@/entities/department';
import { useTemplatesQuery } from '@/entities/template';
import { useStaffQuery } from '@/entities/user';
import type { User } from '@/shared/types/domain';
import { addDays, todayIso } from '@/shared/lib/date';
import { selectableOptions } from '@/shared/lib/options';
import { toPersonOption } from '@/shared/lib/user';import { Button, Card, DatePicker, Input, Select } from '@/shared/ui';
import { createEmployeeSchema, type CreateEmployeeValues } from '../model/schema';
import { useCreateEmployee } from '../model/useCreateEmployee';
import pageStyles from '@/pages/page.module.css';

export function CreateEmployeeForm({
  onCreated,
  renderTemplatePreview,
}: {
  onCreated: (user: User) => void;
  renderTemplatePreview?: (templateId: string) => ReactNode;
}) {
  const create = useCreateEmployee();
  const { data: staff } = useStaffQuery();
  const { data: departments = [] } = useDepartmentsQuery();
  const { data: templates = [] } = useTemplatesQuery();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEmployeeValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      departmentId: '',
      startDate: addDays(todayIso(), 7),
      managerId: '',
      mentorId: '',
      templateId: 'basic',
    },
  });
  const pick = (field: 'departmentId' | 'managerId' | 'mentorId' | 'templateId') => (value: string) =>
    setValue(field, value, { shouldValidate: true });

  const save = ({ mentorId, ...values }: CreateEmployeeValues) =>
    create.mutate({ ...values, mentorId: mentorId || undefined }, { onSuccess: onCreated });
  const templateId = watch('templateId');

  return (
    <form className={pageStyles.formPage} onSubmit={handleSubmit(save)} noValidate>
      <Card className={pageStyles.panel}>
        <h2>Сотрудник</h2>
        <div className={pageStyles.formGrid}>
          <Input label="Имя" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Фамилия" error={errors.lastName?.message} {...register('lastName')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Должность" error={errors.position?.message} {...register('position')} />
          <Select
            label="Отдел"
            placeholder="Выберите отдел"
            value={watch('departmentId')}
            options={selectableOptions(departments, undefined, toDepartmentOption)}
            onChange={pick('departmentId')}
            error={errors.departmentId?.message}
          />
          <DatePicker
            label="Дата выхода"
            value={watch('startDate')}
            onChange={(startDate) => setValue('startDate', startDate, { shouldValidate: true })}
            error={errors.startDate?.message}
          />
        </div>
      </Card>
      <Card className={pageStyles.panel}>
        <h2>Команда адаптации</h2>
        <p className={pageStyles.panelLead}>
          Задачи шаблона с ролью «Руководитель» или «Наставник» назначатся на выбранных людей.
        </p>
        <div className={pageStyles.formGrid}>
          <Select
            label="Руководитель"
            placeholder="Выберите руководителя"
            value={watch('managerId')}
            options={selectableOptions(staff?.managers, undefined, toPersonOption)}
            onChange={pick('managerId')}
            error={errors.managerId?.message}
          />
          <Select
            label="Наставник"
            value={watch('mentorId')}
            options={[
              { value: '', label: 'Без наставника' },
              ...selectableOptions(staff?.mentors, undefined, toPersonOption),
            ]}
            onChange={pick('mentorId')}
          />
        </div>
      </Card>
      <Card className={pageStyles.panel}>
        <h2>План адаптации</h2>
        <p className={pageStyles.panelLead}>Сроки задач считаются от даты выхода.</p>
        <Select
          label="Шаблон"
          value={templateId}
          options={selectableOptions(templates, undefined, (item) => ({ value: item.id, label: item.title }))}
          onChange={pick('templateId')}
          error={errors.templateId?.message}
        />
        {templateId && renderTemplatePreview && (
          <div className={pageStyles.stageTasks}>{renderTemplatePreview(templateId)}</div>
        )}
      </Card>
      {create.error && <p className={pageStyles.formError}>{create.error.message}</p>}
      <div className={pageStyles.formActions}>
        <Button type="submit" loading={create.isPending}>
          Добавить сотрудника
        </Button>
      </div>
    </form>
  );
}
