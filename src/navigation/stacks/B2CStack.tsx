import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DocumentsScreen } from '@/features/documents';
import { GuideScreen } from '@/features/guide';
import { JourJScreen } from '@/features/jourj';
import { EditProfileScreen } from '@/features/profile';
import { MyOrganizationScreen } from '@/features/organization';
import { CreateMobilityScreen } from '@/features/mobility/screens/CreateMobilityScreen';
import { B2CTabNavigator } from '../tabs/B2CTabNavigator';
import { B2CStackParamList } from '../types';
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen';

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
      <Stack.Screen name="MyOrganization" component={MyOrganizationScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
