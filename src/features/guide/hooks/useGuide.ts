import { useQuery } from '@tanstack/react-query';
import { useMobility } from '@/features/mobility/hooks/useMobility';
import { guideService } from '../services/guide.service';

export const GUIDE_QUERY_KEY = 'guide';

export function useGuide() {
  const { data: mobility, isLoading: isMobilityLoading } = useMobility();
  const destinationId = mobility?.destinationId;
  const query = useQuery({
    queryKey: [GUIDE_QUERY_KEY, destinationId],
    queryFn: () => guideService.getGuide(destinationId!),
    enabled: !!destinationId,
    staleTime: 1000 * 60 * 60,
  });
  return { ...query, mobility, isLoading: isMobilityLoading || query.isLoading };
}
