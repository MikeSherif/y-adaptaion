import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  ListTodo,
  Settings,
  UserRound,
} from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { LogoutButton } from '@/features/logout';
import { useAppStore } from '@/shared/model/useAppStore';
import styles from './AppSidebar.module.css';
const links = [
  { to: '/', label: 'Главная', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Моя адаптация', icon: ClipboardCheck },
  { to: '/tasks', label: 'Задачи', icon: ListTodo },
  { to: '/materials', label: 'Материалы', icon: BookOpen },
  { to: '/profile', label: 'Профиль', icon: UserRound },
] as const;
export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isOpen = useAppStore((state) => state.isMobileMenuOpen);
  const close = useAppStore((state) => state.closeMobileMenu);
  return (
    <>
      <button
        className={isOpen ? styles.backdropOpen : styles.backdrop}
        aria-label="Закрыть меню"
        onClick={close}
      />
      <aside className={isOpen ? styles.sidebarOpen : styles.sidebar}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span>К</span>Команда
        </Link>
        <nav aria-label="Основная навигация" className={styles.nav}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={
                pathname === to || (to !== '/' && pathname.startsWith(to))
                  ? styles.active
                  : styles.item
              }
              onClick={close}
              aria-current={pathname === to ? 'page' : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.bottom}>
          <Link to="/profile" className={styles.item} onClick={close}>
            <Settings size={19} />
            <span>Настройки</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
