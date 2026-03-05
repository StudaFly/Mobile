import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '@/features/dashboard';
import { TimelineScreen } from '@/features/timeline';
import { ChecklistScreen } from '@/features/checklist';
import { BudgetScreen } from '@/features/budget';
import { ProfileScreen } from '@/features/profile';
import { B2CTabParamList } from '../types';

const Tab = createBottomTabNavigator<B2CTabParamList>();

export function B2CTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Checklist" component={ChecklistScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
