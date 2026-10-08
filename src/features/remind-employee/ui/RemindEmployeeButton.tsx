import { Bell } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useRemindEmployee } from '../model/useRemindEmployee';

const REMINDER_WINDOW_MS = 10 * 60 * 1000;

function isRecent(value?: string) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < REMINDER_WINDOW_MS;
}

export function RemindEmployeeButton({
  userId,
  overdueCount,
  lastRemindedAt,
}: {
  userId: string;
  overdueCount: number;
  lastRemindedAt?: string;
}) {
  const mutation = useRemindEmployee();
  if (overdueCount <= 0) return null;
  const sent = mutation.isSuccess || isRecent(lastRemindedAt);
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={sent}
      loading={mutation.isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void mutation.mutateAsync(userId);
      }}
    >
      <Bell size={16} />
      {sent ? 'Напомнили' : 'Напомнить'}
    </Button>
  );
}
