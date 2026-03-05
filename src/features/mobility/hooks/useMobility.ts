import { useQuery } from '@tanstack/react-query';
import { mobilityService } from '../services/mobility.service';
import { useMobilityStore } from '../store/mobility.store';

export function useMobility() {
  const activeMobilityId = useMobilityStore((s) => s.activeMobilityId);
  return useQuery({
    queryKey: ['mobility', activeMobilityId],
    queryFn: () => mobilityService.getById(activeMobilityId!),
    enabled: !!activeMobilityId,
  });
}
