import { useQuery } from '@tanstack/react-query';
import { getOnboarding } from '@/shared/api';
import { onboardingKeys } from '@/shared/api/query-keys';
export function useOnboardingQuery() {
  return useQuery({ queryKey: onboardingKeys.current(), queryFn: getOnboarding });
}
