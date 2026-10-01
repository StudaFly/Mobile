import { useQuery } from '@tanstack/react-query';
import { mobilityService } from '../services/mobility.service';
import { useMobility } from './useMobility';

export function useActiveDestination() {
  const { data: mobility } = useMobility();
  const destinationId = mobility?.destinationId;
  return useQuery({
    queryKey: ['destination', destinationId],
    queryFn: () => mobilityService.getDestination(destinationId!),
    enabled: !!destinationId,
    staleTime: Infinity,
  });
}
