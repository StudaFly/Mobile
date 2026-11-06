import type { OrgRole, OrganizationSummary } from '@/features/auth/types/auth.types';

export type FollowUp = 'ok' | 'warning' | 'danger';

export interface OrgInfo extends OrganizationSummary {
  settings: Record<string, unknown>;
  myMemberId: string;
  myOrgRole: OrgRole;
  myCountries: string[];
  myZones: string[];
}

export interface AdvisorRef {
  memberId: string;
  name: string;
}

export interface StudentMobility {
  id: string;
  type: string;
  status: string;
  departureDate: string;
  returnDate: string | null;
  city: string;
  country: string;
  countryCode: string | null;
  advisor: AdvisorRef | null;
  assignment: 'override' | 'perimeter' | null;
  tasksDone: number;
  tasksTotal: number;
  overdueTasks: number;
  progress: number;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  followUp: FollowUp | null;
  mobility: StudentMobility | null;
}

export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  joinedAt: string;
  source: string;
  followUp: FollowUp | null;
  mobilities: (StudentMobility & {
    categories: { category: string; done: number; total: number }[];
    documents: { id: string; category: string | null; uploadedAt: string }[];
  })[];
}

export interface Note {
  id: string;
  body: string;
  author: AdvisorRef | null;
  createdAt: string;
}

export interface Zone {
  key: string;
  countries: string[];
}
