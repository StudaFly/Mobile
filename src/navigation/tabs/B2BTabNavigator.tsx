import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  B2BDashboardScreen,
  StudentsScreen,
  AlertsScreen,
  StatsScreen,
  SettingsScreen,
} from '@/features/b2b';
import { B2BTabParamList } from '../types';

const Tab = createBottomTabNavigator<B2BTabParamList>();

export function B2BTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="B2BDashboard" component={B2BDashboardScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
