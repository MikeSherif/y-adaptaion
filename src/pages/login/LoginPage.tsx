import { CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth';
import styles from './LoginPage.module.css';
export function LoginPage() {
  const navigate = useNavigate();
  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.logo}>
          <span>К</span>Команда
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Sparkles size={15} />
            Вместе с первого дня
          </p>
          <h1>Адаптация, в которой легко ориентироваться.</h1>
          <p>Ваш личный маршрут: задачи, материалы, встречи и поддержка команды в одном месте.</p>
          <ul>
            <li>
              <CheckCircle2 size={18} />
              Понятный план на первые недели
            </li>
            <li>
              <CheckCircle2 size={18} />
              Задачи и дедлайны без лишнего шума
            </li>
            <li>
              <CheckCircle2 size={18} />
              Быстрый доступ к знаниям команды
            </li>
          </ul>
        </div>
        <p className={styles.footer}>© 2026 Команда</p>
      </section>
      <section className={styles.formSide}>
        <div className={styles.card}>
          <p className={styles.welcome}>С возвращением</p>
          <h2>Войдите в аккаунт</h2>
          <p className={styles.sub}>Используйте рабочие данные для продолжения.</p>
          <LoginForm onSuccess={() => void navigate({ to: '/' })} />
        </div>
      </section>
    </main>
  );
}
