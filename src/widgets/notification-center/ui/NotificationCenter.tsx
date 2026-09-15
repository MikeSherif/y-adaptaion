import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useNotificationsQuery } from '@/entities/notification';
import { useMarkNotificationAsRead } from '@/features/mark-notification-as-read';
import { Card, ErrorState, Skeleton } from '@/shared/ui';
import styles from './NotificationCenter.module.css';
export function NotificationCenter({ compact = true }: { compact?: boolean }) {
  const { data, isLoading, isError, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationAsRead();
  const items = compact ? data?.slice(0, 4) : data;
  return (
    <Card className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2>{compact ? 'Уведомления' : 'Все уведомления'}</h2>
          <p>{data?.filter((item) => !item.isRead).length ?? 0} непрочитанных</p>
        </div>
        {compact && <Link to="/notifications">Все</Link>}
      </div>
      {isLoading && (
        <div className={styles.list}>
          <Skeleton height={58} />
          <Skeleton height={58} />
          <Skeleton height={58} />
        </div>
      )}
      {isError && <ErrorState onRetry={() => void refetch()} />}{' '}
      {items && (
        <div className={styles.list}>
          {items.map((notification) => (
            <Link
              key={notification.id}
              to={notification.link ?? '/notifications'}
              className={notification.isRead ? styles.item : styles.unread}
              onClick={() => !notification.isRead && markRead.mutate(notification.id)}
            >
              <span className={styles.noticeIcon}>
                <Bell size={16} />
              </span>
              <span className={styles.copy}>
                <strong>{notification.title}</strong>
                <small>{notification.description}</small>
              </span>
              {!notification.isRead ? <i aria-label="Не прочитано" /> : <CheckCheck size={16} />}
              <ChevronRight className={styles.chevron} size={16} />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
