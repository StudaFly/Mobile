export type MobilityType = 'erasmus' | 'stage' | 'semestre' | 'double_diplome';
export type MobilityStatus = 'preparing' | 'departed' | 'completed';

export interface Mobility {
  id: string;
  userId: string;
  destinationId: string;
  type: MobilityType;
  departureDate: string;
  returnDate?: string;
  status: MobilityStatus;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  universityName?: string;
}
