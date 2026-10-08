import type { ReactNode } from 'react';
import {
  BellRing,
  CalendarClock,
  IdCard,
  ListPlus,
  ListX,
  MessageCircle,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityEntry, ActivityKind } from '@/shared/types/domain';
import { formatDateTime } from '@/shared/lib/date';
import styles from './ActivityItem.module.css';

const kindIcons: Record<ActivityKind, LucideIcon> = {
  employee_created: UserPlus,
  task_created: ListPlus,
  task_updated: CalendarClock,
  task_removed: ListX,
  reminder: BellRing,
  team_changed: UsersRound,
  profile_changed: IdCard,
  comment: MessageCircle,
};

export function ActivityItem({ entry, action }: { entry: ActivityEntry; action?: ReactNode }) {
  const Icon = kindIcons[entry.kind];
  return (
    <li className={styles.item}>
      <span className={styles.icon}>
        <Icon size={15} />
      </span>
      <div className={styles.copy}>
        <strong>{entry.title}</strong>
        {entry.description && <p>{entry.description}</p>}
        <small>
          {entry.actorName} · {formatDateTime(entry.createdAt)}
        </small>
        {action}
      </div>
    </li>
  );
}
