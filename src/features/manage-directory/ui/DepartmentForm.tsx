import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Department } from '@/shared/types/domain';
import { Button, Input } from '@/shared/ui';
import { departmentSchema, type DepartmentValues } from '../model/schema';
import { useSaveDepartment } from '../model/useManageDirectory';
import styles from './DirectoryForm.module.css';

export function DepartmentForm({ department, onDone }: { department?: Department; onDone: () => void }) {
  const save = useSaveDepartment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: department?.name ?? '' },
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((payload) => save.mutate({ id: department?.id, payload }, { onSuccess: onDone }))}
      noValidate
    >
      <Input label="Название отдела" autoFocus error={errors.name?.message} {...register('name')} />
      {save.error && <p className={styles.error}>{save.error.message}</p>}
      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Отмена
        </Button>
        <Button type="submit" loading={save.isPending}>
          {department ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
}
