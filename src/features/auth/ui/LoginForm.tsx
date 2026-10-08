import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, KeyRound, Mail } from 'lucide-react';
import { Button, Input } from '@/shared/ui';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/shared/lib/auth';
import { loginSchema, type LoginValues } from '../model/schema';
import { useAuthStore } from '../model/useAuthStore';
import styles from './LoginForm.module.css';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const signIn = useAuthStore((state) => state.signIn);
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'employee@example.com', password: DEMO_PASSWORD },
  });
  const onSubmit = async (values: LoginValues) => {
    setServerError(undefined);
    try {
      await signIn(values.email, values.password);
      onSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Не удалось войти');
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Рабочий email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {serverError && (
        <p className={styles.error} role="alert">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className={styles.submit}>
        Войти <ArrowRight size={17} />
      </Button>
      <div className={styles.demos}>
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            className={styles.demo}
            onClick={() => {
              setValue('email', account.email, { shouldValidate: true });
              setValue('password', DEMO_PASSWORD, { shouldValidate: true });
            }}
          >
            Войти как {account.label}
          </button>
        ))}
      </div>
      <div className={styles.hint}>
        {DEMO_ACCOUNTS.map((account) => (
          <p key={account.email}>
            <Mail size={15} /> {account.email}
            <span> · {account.label}</span>
          </p>
        ))}
        <p>
          <KeyRound size={15} /> {DEMO_PASSWORD}
        </p>
      </div>
    </form>
  );
}
