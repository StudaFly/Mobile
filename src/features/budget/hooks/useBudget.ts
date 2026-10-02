import { useQuery } from '@tanstack/react-query';
import { useMobility } from '@/features/mobility/hooks/useMobility';
import { budgetService } from '../services/budget.service';

export const BUDGET_QUERY_KEY = 'budget';

export function useBudget() {
  const { data: mobility, isLoading: isMobilityLoading } = useMobility();
  const destinationId = mobility?.destinationId;
  const query = useQuery({
    queryKey: [BUDGET_QUERY_KEY, destinationId],
    queryFn: () => budgetService.getBudget(destinationId!),
    enabled: !!destinationId,
  });
  return { ...query, mobility, isLoading: isMobilityLoading || query.isLoading };
}
