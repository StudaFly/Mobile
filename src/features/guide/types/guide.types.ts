export interface GuideSection {
  key: string;
  title: string;
  content: string;
}

export interface GuideStep {
  title: string;
  description: string;
  timing: string;
}

export interface DestinationGuide {
  destinationId: string;
  city: string;
  country: string;
  sections: GuideSection[];
  tips: string[];
  keySteps: GuideStep[];
  emergencyContacts: Record<string, string>;
  usefulApps: string[];
}
