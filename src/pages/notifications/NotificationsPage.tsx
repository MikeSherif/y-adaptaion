import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useNotificationsQuery } from '@/entities/notification';
import { useMarkNotificationAsRead } from '@/features/mark-notification-as-read';
import { Card, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import styles from '@/pages/page.module.css';
import localStyles from './NotificationsPage.module.css';
export function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationAsRead();
  if (isLoading)
    return (
      <div className={styles.page}>
        <Skeleton height={70} />
        <Skeleton height={380} />
      </div>
    );
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const unread = data.filter((item) => !item.isRead);
  const read = data.filter((item) => item.isRead);
  const group = (title: string, items: typeof data) => (
    <section className={styles.noticeGroup}>
      <h2>
        {title} · {items.length}
      </h2>
      <Card className={localStyles.card}>
        {items.map((notification) => (
          <Link
            key={notification.id}
            to={notification.link ?? '/notifications'}
            className={notification.isRead ? localStyles.item : localStyles.unread}
            onClick={() => !notification.isRead && markRead.mutate(notification.id)}
          >
            <span className={localStyles.icon}>
              <Bell size={18} />
            </span>
            <span className={localStyles.copy}>
              <strong>{notification.title}</strong>
              <p>{notification.description}</p>
              <small>
                {new Intl.DateTimeFormat('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(notification.createdAt))}
              </small>
            </span>
            {notification.isRead ? (
              <CheckCheck size={18} />
            ) : (
              <span className={localStyles.dot} aria-label="Не прочитано" />
            )}
            <ChevronRight size={17} />
          </Link>
        ))}
      </Card>
    </section>
  );
  return (
    <div className={`${styles.page} ${styles.notificationPage}`}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Центр уведомлений</p>
          <h1>Уведомления</h1>
          <p>Важные события, напоминания и обновления адаптации.</p>
        </div>
      </div>
      {data.length === 0 ? (
        <Card>
          <EmptyState title="Уведомлений пока нет" />
        </Card>
      ) : (
        <>
          {unread.length > 0 && group('Новые', unread)}
          {read.length > 0 && group('Ранее', read)}
        </>
      )}
    </div>
  );
}
