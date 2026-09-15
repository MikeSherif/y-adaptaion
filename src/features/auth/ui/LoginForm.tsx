import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, KeyRound, Mail } from 'lucide-react';
import { Button, Input } from '@/shared/ui';
import { loginSchema, type LoginValues } from '../model/schema';
import { useAuthStore } from '../model/useAuthStore';
import styles from './LoginForm.module.css';
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const signIn = useAuthStore((state) => state.signIn);
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'employee@example.com', password: 'password' },
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
      <div className={styles.hint}>
        <p>
          <Mail size={15} /> employee@example.com
        </p>
        <p>
          <KeyRound size={15} /> password
        </p>
      </div>
    </form>
  );
}
