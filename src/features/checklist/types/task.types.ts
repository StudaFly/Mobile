export type TaskCategory = 'admin' | 'finance' | 'housing' | 'health' | 'practical';
export type TaskPriority = 1 | 2 | 3;
export interface Task {
  id: string;
  mobilityId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  deadline?: string | null;
  daysUntilDeadline?: number | null;
  isCompleted: boolean;
  priority: TaskPriority;
}
