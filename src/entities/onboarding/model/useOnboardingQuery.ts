import { useQuery } from '@tanstack/react-query';
import { getOnboarding } from '@/shared/api';
import { onboardingKeys } from '@/shared/api/query-keys';

export function useOnboardingQuery(userId?: string) {
  return useQuery({
    queryKey: onboardingKeys.byUser(userId),
    queryFn: () => getOnboarding(userId),
  });
}
