import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory } from '../types/task.types';
import { checklistService } from '../services/checklist.service';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';

export const CHECKLIST_QUERY_KEY = 'checklist';

export function useChecklist(category?: TaskCategory | 'all') {
  const mobilityId = useMobilityStore((s) => s.activeMobilityId);

  const query = useQuery({
    queryKey: [CHECKLIST_QUERY_KEY, mobilityId],
    queryFn: () => checklistService.getTasks(mobilityId!),
    enabled: !!mobilityId,
  });

  const allTasks: Task[] = query.data ?? [];

  const tasks =
    category && category !== 'all'
      ? allTasks.filter((t) => t.category === category)
      : allTasks;

  const completedCount = allTasks.filter((t) => t.isCompleted).length;
  const totalCount = allTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const taskCountByCategory = {
    all: allTasks.length,
    admin: allTasks.filter((t) => t.category === 'admin').length,
    finance: allTasks.filter((t) => t.category === 'finance').length,
    housing: allTasks.filter((t) => t.category === 'housing').length,
    health: allTasks.filter((t) => t.category === 'health').length,
    practical: allTasks.filter((t) => t.category === 'practical').length,
  };

  return {
    ...query,
    tasks,
    completedCount,
    totalCount,
    progress,
    taskCountByCategory,
    mobilityId: mobilityId ?? '',
  };
}
