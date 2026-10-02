export type MobilityType = 'erasmus' | 'stage' | 'semestre' | 'double_diplome';
export type MobilityStatus = 'preparing' | 'departed' | 'completed';

export interface Mobility {
  id: string;
  userId: string;
  destinationId: string;
  type: MobilityType;
  departureDate: string;
  returnDate: string | null;
  status: MobilityStatus;
  school: string | null;
  createdAt: string;
  daysUntilDeparture: number;
  stayMonths: number | null;
}

export interface MobilityProgress {
  mobilityId: string;
  totalTasks: number;
  completedTasks: number;
  percent: number;
  daysUntilDeparture: number;
  overdueTasks: number;
  byCategory: { category: string; label: string; done: number; total: number }[];
  nextTasks: import('@/features/timeline/types/timeline.types').TimelineTask[];
}

export interface Destination {
  id: string;
  city: string;
  country: string;
}

