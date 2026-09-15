import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/shared/api';
import { notificationKeys } from '@/shared/api/query-keys';
export function useNotificationsQuery() {
  return useQuery({ queryKey: notificationKeys.list(), queryFn: getNotifications });
}
