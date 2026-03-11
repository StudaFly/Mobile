import type { TaskCategory } from '@/features/checklist';

export type TimelineFilter = TaskCategory | 'all';

export interface TimelineTask {
  id: string;
  mobilityId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  deadline?: string;
  isCompleted: boolean;
  priority: 1 | 2 | 3;
}

export interface TimelineGroup {
  monthKey: string;
  monthLabel: string;
  tasks: TimelineTask[];
}
