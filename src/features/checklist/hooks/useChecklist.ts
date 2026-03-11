import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory } from '../types/task.types';
import { checklistService } from '../services/checklist.service';

const MOCK_MOBILITY_ID = 'mock-mobility-1';

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Demande de visa',
    description: 'Déposer le dossier complet au consulat : formulaire, photos, justificatifs financiers et assurance voyage.',
    category: 'admin',
    isCompleted: true,
    priority: 1,
    deadline: '2026-04-15',
  },
  {
    id: '2',
    mobilityId: MOCK_MOBILITY_ID,
    title: "Lettre d'acceptation université",
    description: "Télécharger la lettre officielle depuis le portail de l'université partenaire et la conserver en PDF.",
    category: 'admin',
    isCompleted: true,
    priority: 1,
  },
  {
    id: '3',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Passeport valide +6 mois',
    description: 'Vérifier la date d\'expiration. Si renouvellement nécessaire, compter 3 à 5 semaines.',
    category: 'admin',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '4',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Carte bancaire internationale',
    description: 'Wise ou Revolut recommandés pour éviter les frais de change. Ouvrir le compte au moins 2 semaines avant.',
    category: 'finance',
    isCompleted: false,
    priority: 2,
    deadline: '2026-07-01',
  },
  {
    id: '5',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Budget prévu sur 6 mois',
    description: 'Estimer loyer, alimentation, transports, loisirs. Prévoir un fonds d\'urgence de 500 €.',
    category: 'finance',
    isCompleted: false,
    priority: 3,
  },
  {
    id: '6',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'CEAM (Carte Euro. Assurance Maladie)',
    description: 'Faire la demande sur ameli.fr. Délai de réception : 3 à 4 semaines. Gratuit.',
    category: 'health',
    isCompleted: true,
    priority: 1,
    deadline: '2026-05-15',
  },
  {
    id: '7',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Stock médicaments essentiels',
    description: 'Prévoir 3 mois de traitement si prescription. Certains médicaments français sont introuvables à l\'étranger.',
    category: 'health',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '8',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Contrat de logement signé',
    description: 'Vérifier les clauses de résiliation, l\'état des lieux et l\'assurance habitation obligatoire.',
    category: 'housing',
    isCompleted: false,
    priority: 1,
    deadline: '2026-06-01',
  },
  {
    id: '9',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Inventaire du logement',
    description: 'Photographier chaque pièce à l\'arrivée et envoyer par email au propriétaire dans les 48h.',
    category: 'housing',
    isCompleted: false,
    priority: 3,
  },
  {
    id: '10',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'SIM locale ou forfait international',
    description: 'Comparer les opérateurs locaux sur place. Orange, SFR et Bouygues proposent des options Europe.',
    category: 'practical',
    isCompleted: false,
    priority: 2,
  },
  {
    id: '11',
    mobilityId: MOCK_MOBILITY_ID,
    title: 'Adaptateur électrique',
    description: 'Vérifier la tension (220V/110V) et le type de prise du pays de destination.',
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
