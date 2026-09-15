import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarDays, Mail, Pencil, Phone, UsersRound } from 'lucide-react';
import { useUserQuery } from '@/entities/user';
import { useOnboardingQuery } from '@/entities/onboarding';
import { profileSchema, type ProfileValues, useUpdateProfile } from '@/features/update-profile';
import { Avatar, Button, Card, ErrorState, Input, Skeleton } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import styles from '@/pages/page.module.css';
export function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useUserQuery();
  const { data: onboarding } = useOnboardingQuery();
  const update = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });
  useEffect(() => {
    if (user)
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName ?? '',
        phone: user.phone ?? '',
      });
  }, [user, reset]);
  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={80} />
        <Skeleton height={350} />
      </div>
    );
  if (isError || !user) return <ErrorState onRetry={() => void refetch()} />;
  const save = async (values: ProfileValues) => {
    await update.mutateAsync(values);
    setEditing(false);
  };
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Личный кабинет</p>
          <h1>Профиль</h1>
          <p>Управляйте персональными и рабочими данными.</p>
        </div>
        <Button variant="secondary" onClick={() => setEditing((value) => !value)}>
          <Pencil size={16} />
          {editing ? 'Отменить' : 'Редактировать'}
        </Button>
      </div>
      <div className={styles.profile}>
        <Card className={styles.profileAside}>
          <Avatar user={user} large />
          <div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p>{user.position}</p>
          </div>
        </Card>
        <Card className={styles.panel}>
          {editing ? (
            <form onSubmit={handleSubmit((values) => void save(values))} noValidate>
              <h2>Редактирование профиля</h2>
              <div className={styles.formGrid}>
                <Input label="Имя" error={errors.firstName?.message} {...register('firstName')} />
                <Input label="Фамилия" error={errors.lastName?.message} {...register('lastName')} />
                <Input label="Отчество" {...register('middleName')} />
                <Input label="Телефон" error={errors.phone?.message} {...register('phone')} />
              </div>
              <div className={styles.formActions}>
                <Button type="submit" loading={update.isPending}>
                  Сохранить изменения
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h2>Личные данные</h2>
              <div className={styles.keyValue}>
                <div>
                  <span>
                    <Mail size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Email
                  </span>
                  <strong>{user.email}</strong>
                </div>
                <div>
                  <span>
                    <Phone size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Телефон
                  </span>
                  <strong>{user.phone ?? 'Не указан'}</strong>
                </div>
                <div>
                  <span>
                    <UsersRound size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Отдел
                  </span>
                  <strong>{user.department.name}</strong>
                </div>
                <div>
                  <span>
                    <CalendarDays size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Начало работы
                  </span>
                  <strong>{formatDate(user.startDate)}</strong>
                </div>
                <div>
                  <span>Руководитель</span>
                  <strong>
                    {user.manager
                      ? `${user.manager.firstName} ${user.manager.lastName}`
                      : 'Не указан'}
                  </strong>
                </div>
                <div>
                  <span>Прогресс адаптации</span>
                  <strong>{onboarding?.progress ?? 0}%</strong>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
