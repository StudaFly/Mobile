import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StudentDetailScreen,
  SchoolTasksScreen,
  BrandingScreen,
} from '@/features/b2b';
import { B2BTabNavigator } from '../tabs/B2BTabNavigator';
import { B2BStackParamList } from '../types';

const Stack = createNativeStackNavigator<B2BStackParamList>();

export function B2BStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={B2BTabNavigator} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="SchoolTasks" component={SchoolTasksScreen} />
      <Stack.Screen name="Branding" component={BrandingScreen} />
    </Stack.Navigator>
  );
}
