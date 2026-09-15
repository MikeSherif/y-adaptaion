import { Bell, Menu, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useUserQuery } from '@/entities/user';
import { useNotificationsQuery } from '@/entities/notification';
import { Avatar, IconButton, Skeleton } from '@/shared/ui';
import { useAppStore } from '@/shared/model/useAppStore';
import styles from './AppHeader.module.css';
export function AppHeader() {
  const { data: user } = useUserQuery();
  const { data: notifications } = useNotificationsQuery();
  const toggleMenu = useAppStore((state) => state.toggleMobileMenu);
  const unread = notifications?.filter((item) => !item.isRead).length ?? 0;
  return (
    <header className={styles.header}>
      <IconButton className={styles.menu} aria-label="Открыть навигацию" onClick={toggleMenu}>
        <Menu size={20} />
      </IconButton>
      <div className={styles.search}>
        <Search size={18} />
        <span>Поиск по материалам и задачам</span>
      </div>
      <div className={styles.actions}>
        <Link
          to="/notifications"
          className={styles.bell}
          aria-label={`Уведомления: ${unread} непрочитанных`}
        >
          <Bell size={20} />
          {unread > 0 && <span>{unread > 9 ? '9+' : unread}</span>}
        </Link>
        {user ? (
          <Link to="/profile" className={styles.profile}>
            <Avatar user={user} />
            <div>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <small>{user.position}</small>
            </div>
          </Link>
        ) : (
          <div className={styles.loading}>
            <Skeleton height={38} />
          </div>
        )}
      </div>
    </header>
  );
}
