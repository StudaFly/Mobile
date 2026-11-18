import { useAuthStore } from '@/features/auth';
import { useActiveDestination, useMobility, useProgress, useMobilityStore } from '@/features/mobility';

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
