import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DocumentsScreen } from '@/features/documents';
import { GuideScreen } from '@/features/guide';
import { JourJScreen } from '@/features/jourj';
import { EditProfileScreen } from '@/features/profile';
import { CreateMobilityScreen } from '@/features/mobility/screens/CreateMobilityScreen';
import { B2CTabNavigator } from '../tabs/B2CTabNavigator';
import { B2CStackParamList } from '../types';

const Stack = createNativeStackNavigator<B2CStackParamList>();

export function B2CStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={B2CTabNavigator} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Guide" component={GuideScreen} />
      <Stack.Screen name="JourJ" component={JourJScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="CreateMobility" component={CreateMobilityScreen} />
    </Stack.Navigator>
  );
}
