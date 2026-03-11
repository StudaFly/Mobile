import { useQuery } from '@tanstack/react-query';
import { timelineService } from '../services/timeline.service';
import type { TimelineTask, TimelineFilter, TimelineGroup } from '../types/timeline.types';

const MOCK_MOBILITY_ID = 'mock-mobility-1';
const MOCK_DEPARTURE_DATE = new Date('2026-09-01');

const MOCK_TIMELINE_TASKS: TimelineTask[] = [
  {
    id: 'tl1',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Inscription université partenaire',
    description: 'Soumettre le formulaire de candidature en ligne',
    category: 'admin',
    deadline: '2026-03-20',
    isCompleted: false,
    priority: 1,
  },
  {
    id: 'tl2',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Ouverture compte bancaire international',
    description: 'Wise ou Revolut recommandés pour éviter les frais',
    category: 'finance',
    deadline: '2026-03-31',
    isCompleted: false,
    priority: 1,
  },
  {
    id: 'tl3',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Dossier de visa Schengen',
    category: 'admin',
    deadline: '2026-04-15',
    isCompleted: false,
    priority: 2,
  },
  {
    id: 'tl4',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Réservation logement',
    description: 'Idealist, Fotocasa ou résidence universitaire',
    category: 'housing',
    deadline: '2026-04-30',
    isCompleted: false,
    priority: 2,
  },
  {
    id: 'tl5',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Carte Européenne Assurance Maladie',
    description: 'Demande sur ameli.fr (délai 3-4 semaines)',
    category: 'health',
    deadline: '2026-05-15',
    isCompleted: true,
    priority: 1,
  },
  {
    id: 'tl6',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Billet aller-retour',
    category: 'practical',
    deadline: '2026-06-01',
    isCompleted: false,
    priority: 2,
  },
  {
    id: 'tl7',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Assurance habitation',
    description: 'Obligatoire pour la résidence universitaire',
    category: 'housing',
    deadline: '2026-07-01',
    isCompleted: false,
    priority: 2,
  },
  {
    id: 'tl8',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Stock médicaments essentiels',
    category: 'health',
    deadline: '2026-08-15',
    isCompleted: false,
    priority: 3,
  },
];

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

function getDaysUntilDeparture(): number {
  const now = new Date();
  return Math.ceil((MOCK_DEPARTURE_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function useTimeline(filter: TimelineFilter = 'all') {
  const mobilityId = MOCK_MOBILITY_ID;

  const query = useQuery({
    queryKey: [TIMELINE_QUERY_KEY, mobilityId],
    queryFn: async (): Promise<TimelineTask[]> => {
      try {
        return await timelineService.getTimeline(mobilityId);
      } catch {
        return MOCK_TIMELINE_TASKS;
      }
    },
    initialData: MOCK_TIMELINE_TASKS,
    staleTime: Infinity,
  });

  const allTasks = query.data ?? MOCK_TIMELINE_TASKS;
  const filteredTasks = filter === 'all' ? allTasks : allTasks.filter((t) => t.category === filter);
  const groups = groupTasksByMonth(filteredTasks);

  const completedCount = allTasks.filter((t) => t.isCompleted).length;
  const totalCount = allTasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const urgentTasks = allTasks.filter((t) => !t.isCompleted && t.priority === 1 && t.deadline);
  const daysUntilDeparture = getDaysUntilDeparture();

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
