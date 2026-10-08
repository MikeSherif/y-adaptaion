import { MessageCircle } from 'lucide-react';
import { CommentItem, useTaskCommentsQuery } from '@/entities/task-comment';
import { AddCommentForm } from '@/features/add-task-comment';
import { useAuthStore } from '@/features/auth';
import { Card, Skeleton } from '@/shared/ui';
import pageStyles from '@/pages/page.module.css';
import styles from './TaskDiscussion.module.css';

export function TaskDiscussion({
  taskId,
  emptyText,
  placeholder = 'Напишите сообщение',
}: {
  taskId: string;
  emptyText: string;
  placeholder?: string;
}) {
  const viewerId = useAuthStore((state) => state.session?.userId);
  const { data: comments, isLoading } = useTaskCommentsQuery(taskId);

  return (
    <Card className={pageStyles.panel}>
      <h2 className={styles.title}>
        <MessageCircle size={18} />
        Обсуждение
        {comments && comments.length > 0 && <span>{comments.length}</span>}
      </h2>
      {isLoading ? (
        <Skeleton height={80} />
      ) : comments?.length ? (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} own={comment.authorId === viewerId} />
          ))}
        </ul>
      ) : (
        <p className={pageStyles.panelLead}>{emptyText}</p>
      )}
      <AddCommentForm taskId={taskId} placeholder={placeholder} />
    </Card>
  );
}
