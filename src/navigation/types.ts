export type RootStackParamList = {
  Auth: undefined;
  B2C: undefined;
  B2B: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: { initialTab?: 'login' | 'register' } | undefined;
  CreateProfile: undefined;
  Onboarding: undefined;
};

export type B2CTabParamList = {
  Dashboard: undefined;
  Timeline: undefined;
  Checklist: undefined;
  Budget: undefined;
  Profile: undefined;
};

export type B2CStackParamList = {
  Tabs: undefined;
  Documents: undefined;
  Guide: undefined;
  JourJ: undefined;
  EditProfile: undefined;
};

export type B2BTabParamList = {
  B2BDashboard: undefined;
  Students: undefined;
  Alerts: undefined;
  Stats: undefined;
  Settings: undefined;
};

export type B2BStackParamList = {
  Tabs: undefined;
  StudentDetail: { studentId: string };
  SchoolTasks: undefined;
  Branding: undefined;
};
