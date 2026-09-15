import { useQuery } from '@tanstack/react-query';
import { getOnboardingStage } from '@/shared/api';
import { stageKeys } from '@/shared/api/query-keys';
export function useStageQuery(stageId: string) {
  return useQuery({
    queryKey: stageKeys.detail(stageId),
    queryFn: () => getOnboardingStage(stageId),
  });
}
