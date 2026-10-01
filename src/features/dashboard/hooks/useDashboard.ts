import { useAuthStore } from '@/features/auth/store/auth.store';
import { useActiveDestination } from '@/features/mobility/hooks/useActiveDestination';
import { useMobility } from '@/features/mobility/hooks/useMobility';
import { useProgress } from '@/features/mobility/hooks/useProgress';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';

export function useDashboard() {
  const user = useAuthStore((s) => s.user);
  const mobilityId = useMobilityStore((s) => s.activeMobilityId);
  const { data: mobility } = useMobility();
  const { data: destination } = useActiveDestination();
  const progress = useProgress();

  return {
    user,
    mobility,
    destination,
    mobilityId,
    daysUntilDeparture: progress.data?.daysUntilDeparture ?? mobility?.daysUntilDeparture ?? null,
    completedCount: progress.data?.completedTasks ?? 0,
    totalCount: progress.data?.totalTasks ?? 0,
    percent: progress.data?.percent ?? 0,
    nextTasks: progress.data?.nextTasks ?? [],
    categoryProgress: progress.data?.byCategory ?? [],
    isLoading: progress.isLoading,
    isError: progress.isError,
    refetch: progress.refetch,
    isRefetching: progress.isRefetching,
  };
}
