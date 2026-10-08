import {
  BookOpen,
  ClipboardCheck,
  Contact,
  LayoutDashboard,
  LayoutTemplate,
  ListTodo,
  Bell,
  UserRound,
  Users,
} from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { LogoutButton } from '@/features/logout';
import { useAuthStore } from '@/features/auth';
import { useAppStore } from '@/shared/model/useAppStore';
import styles from './AppSidebar.module.css';

const employeeLinks = [
  { to: '/', label: 'Главная', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Моя адаптация', icon: ClipboardCheck },
  { to: '/tasks', label: 'Задачи', icon: ListTodo },
  { to: '/materials', label: 'Материалы', icon: BookOpen },
] as const;

const adminLinks = [
  { to: '/admin/employees', label: 'Сотрудники', icon: Users },
  { to: '/admin/templates', label: 'Шаблоны', icon: LayoutTemplate },
  { to: '/admin/materials', label: 'Материалы', icon: BookOpen },
  { to: '/admin/directories', label: 'Справочники', icon: Contact },] as const;

const sharedLinks = [{ to: '/profile', label: 'Профиль', icon: UserRound }] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const role = useAuthStore((state) => state.session?.role);
  const isOpen = useAppStore((state) => state.isMobileMenuOpen);
  const close = useAppStore((state) => state.closeMobileMenu);
  const home = role === 'admin' ? '/admin/employees' : '/';
  const links = [...(role === 'admin' ? adminLinks : employeeLinks), ...sharedLinks];

  return (
    <>
      <button
        className={isOpen ? styles.backdropOpen : styles.backdrop}
        aria-label="Закрыть меню"
        onClick={close}
      />
      <aside className={isOpen ? styles.sidebarOpen : styles.sidebar}>
        <Link to={home} className={styles.brand} onClick={close}>
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
          <Link
            to="/notifications"
            className={pathname.startsWith('/notifications') ? styles.active : styles.item}
            onClick={close}
            aria-current={pathname === '/notifications' ? 'page' : undefined}
          >
            <Bell size={19} />
            <span>Уведомления</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
