export interface Institution {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  progressPercent: number;
  mobilityStatus: string;
  isLate: boolean;
}

export interface Alert {
  id: string;
  studentId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}
