import { useQuery } from '@tanstack/react-query';
import { mobilityService } from '../services/mobility.service';
import { useMobilityStore } from '../store/mobility.store';

export const PROGRESS_QUERY_KEY = 'progress';

export function useProgress() {
  const mobilityId = useMobilityStore((s) => s.activeMobilityId);
  return useQuery({
    queryKey: [PROGRESS_QUERY_KEY, mobilityId],
    queryFn: () => mobilityService.getProgress(mobilityId!),
    enabled: !!mobilityId,
  });
}
