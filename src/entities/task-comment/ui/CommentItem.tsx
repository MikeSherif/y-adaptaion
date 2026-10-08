import clsx from 'clsx';
import type { TaskComment } from '@/shared/types/domain';
import { formatDateTime } from '@/shared/lib/date';
import styles from './CommentItem.module.css';

export function CommentItem({ comment, own }: { comment: TaskComment; own: boolean }) {
  return (
    <li className={clsx(styles.item, own && styles.own)}>
      <div className={styles.head}>
        <strong>{comment.authorName}</strong>
        <span>{comment.authorRole === 'admin' ? 'HR' : 'Сотрудник'}</span>
        <time dateTime={comment.createdAt}>{formatDateTime(comment.createdAt)}</time>
      </div>
      <p>{comment.text}</p>
    </li>
  );
}
