import { Outlet } from '@tanstack/react-router';
import { AppHeader } from '@/widgets/app-header';
import { AppSidebar } from '@/widgets/app-sidebar';
import styles from './AppLayout.module.css';
export function AppLayout() {
  return (
    <div className={styles.shell}>
      <AppSidebar />
      <div className={styles.content}>
        <AppHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
