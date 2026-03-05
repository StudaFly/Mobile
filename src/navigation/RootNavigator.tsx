import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/features/auth';
import { AuthStack } from './stacks/AuthStack';
import { B2CStack } from './stacks/B2CStack';
import { B2BStack } from './stacks/B2BStack';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : role === 'admin' || role === 'superadmin' ? (
          <Stack.Screen name="B2B" component={B2BStack} />
        ) : (
          <Stack.Screen name="B2C" component={B2CStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
