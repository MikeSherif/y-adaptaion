import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui';
import styles from '@/pages/page.module.css';
export function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Похоже, такой страницы в вашем маршруте адаптации нет.</p>
      <Link to="/">
        <Button>На главную</Button>
      </Link>
    </div>
  );
}
