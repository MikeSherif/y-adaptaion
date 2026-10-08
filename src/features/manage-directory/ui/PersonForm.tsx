import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { StaffKind, StaffMember } from '@/shared/types/domain';
import { Button, Input } from '@/shared/ui';
import { staffSchema, type StaffValues } from '../model/schema';
import { useSaveStaffMember } from '../model/useManageDirectory';
import styles from './DirectoryForm.module.css';

export function PersonForm({
  kind,
  member,
  onDone,
}: {
  kind: StaffKind;
  member?: StaffMember;
  onDone: () => void;
}) {
  const save = useSaveStaffMember(kind);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: member?.firstName ?? '',
      lastName: member?.lastName ?? '',
      position: member?.position ?? '',
    },
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((payload) => save.mutate({ id: member?.id, payload }, { onSuccess: onDone }))}
      noValidate
    >
      <div className={styles.fields}>
        <Input label="Имя" autoFocus error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Фамилия" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Должность" error={errors.position?.message} {...register('position')} />
      </div>
      {save.error && <p className={styles.error}>{save.error.message}</p>}
      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Отмена
        </Button>
        <Button type="submit" loading={save.isPending}>
          {member ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
}
