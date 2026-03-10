import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory } from '../types/task.types';
import { checklistService } from '../services/checklist.service';

const MOCK_MOBILITY_ID = 'mock-mobility-1';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Demande de visa',
    category: 'admin',
    isCompleted: true,
    priority: 1,
  },
  {
    id: '2',
    mobilityId: MOCK_MOBILITY_ID,
    title: "Lettre d'acceptation université",
    category: 'admin',
    isCompleted: true,
    priority: 1,
  },
  {
    id: '3',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Passeport valide +6 mois',
    category: 'admin',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '4',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Carte bancaire internationale',
    category: 'finance',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '5',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Budget prévu sur 6 mois',
    category: 'finance',
    isCompleted: false,
    priority: 3,
  },
  {
    id: '6',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'CEAM (Carte Euro. Assurance Maladie)',
    category: 'health',
    isCompleted: true,
    priority: 1,
    deadline: '2024-08-15',
  },
  {
    id: '7',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Stock médicaments essentiels',
    category: 'health',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '8',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Contrat de logement signé',
    category: 'housing',
    isCompleted: false,
    priority: 1,
    deadline: '2024-09-01',
  },
  {
    id: '9',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Inventaire du logement',
    category: 'housing',
    isCompleted: false,
    priority: 3,
  },
  {
    id: '10',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'SIM locale ou forfait international',
    category: 'practical',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '11',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Adaptateur électrique',
    category: 'practical',
    isCompleted: true,
    priority: 3,
  },
];

export const CHECKLIST_QUERY_KEY = 'checklist';

export function useChecklist(category?: TaskCategory | 'all') {
  const mobilityId = MOCK_MOBILITY_ID;

  const query = useQuery({
    queryKey: [CHECKLIST_QUERY_KEY, mobilityId],
    queryFn: async (): Promise<Task[]> => {
      try {
        return await checklistService.getTasks(mobilityId);
      } catch {
        return MOCK_TASKS;
      }
    },
    initialData: MOCK_TASKS,
    staleTime: Infinity,
  });

  const allTasks = query.data ?? MOCK_TASKS;

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
    mobilityId,
  };
}
