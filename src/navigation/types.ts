import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  B2C: NavigatorScreenParams<B2CStackParamList> | undefined;
  B2B: NavigatorScreenParams<B2BStackParamList> | undefined;
  WebOnly: undefined;
  Invitation: { token: string };
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
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
  Tabs: NavigatorScreenParams<B2CTabParamList> | undefined;
  Documents: undefined;
  Guide: undefined;
  JourJ: undefined;
  EditProfile: undefined;
  CreateMobility: undefined;
  MyOrganization: undefined;
  Notifications: undefined;
};

export type B2BTabParamList = {
  B2BDashboard: undefined;
  Students: undefined;
  Alerts: undefined;
  Stats: undefined;
  Settings: undefined;
};

export type B2BStackParamList = {
  Tabs: NavigatorScreenParams<B2BTabParamList> | undefined;
  StudentDetail: { studentId: string };
  SchoolTasks: undefined;
  Branding: undefined;
  Notifications: undefined;
};

export type B2CNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<B2CTabParamList>,
  NativeStackNavigationProp<B2CStackParamList>
>;
