import { useQuery } from '@tanstack/react-query';
import { timelineService } from '../services/timeline.service';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';
import { useMobility } from '@/features/mobility/hooks/useMobility';
import type { TimelineTask, TimelineFilter, TimelineGroup } from '../types/timeline.types';

export const TIMELINE_QUERY_KEY = 'timeline';

const MONTH_LABELS: Record<number, string> = {
  0: 'Janvier', 1: 'Février', 2: 'Mars', 3: 'Avril',
  4: 'Mai', 5: 'Juin', 6: 'Juillet', 7: 'Août',
  8: 'Septembre', 9: 'Octobre', 10: 'Novembre', 11: 'Décembre',
};

function groupTasksByMonth(tasks: TimelineTask[]): TimelineGroup[] {
  const sorted = [...tasks].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const groups = new Map<string, TimelineTask[]>();
  for (const task of sorted) {
    const key = task.deadline ? task.deadline.slice(0, 7) : 'sans-date';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(task);
  }

  return Array.from(groups.entries()).map(([key, groupTasks]) => {
    if (key === 'sans-date') {
      return { monthKey: key, monthLabel: 'Sans date', tasks: groupTasks };
    }
    const [year, month] = key.split('-').map(Number);
    return {
      monthKey: key,
      monthLabel: `${MONTH_LABELS[month - 1]} ${year}`,
      tasks: groupTasks,
    };
  });
}

export function useTimeline(filter: TimelineFilter = 'all') {
  const mobilityId = useMobilityStore((s) => s.activeMobilityId);
  const { data: mobility } = useMobility();

  const departureDate = mobility?.departureDate ? new Date(mobility.departureDate) : null;
  const daysUntilDeparture = departureDate
    ? Math.ceil((departureDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const query = useQuery({
    queryKey: [TIMELINE_QUERY_KEY, mobilityId],
    queryFn: () => timelineService.getTimeline(mobilityId!),
    enabled: !!mobilityId,
  });

  const allTasks: TimelineTask[] = query.data ?? [];
  const filteredTasks = filter === 'all' ? allTasks : allTasks.filter((t) => t.category === filter);
  const groups = groupTasksByMonth(filteredTasks);

  const completedCount = allTasks.filter((t) => t.isCompleted).length;
  const totalCount = allTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const urgentTasks = allTasks.filter((t) => !t.isCompleted && t.priority === 1 && t.deadline);

  return {
    ...query,
    groups,
    completedCount,
    totalCount,
    progress,
    urgentTasks,
    daysUntilDeparture,
    mobilityId,
  };
}
