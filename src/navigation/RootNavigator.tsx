import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/features/auth';
import { AuthStack } from './stacks/AuthStack';
import { B2CStack } from './stacks/B2CStack';
import { B2BStack } from './stacks/B2BStack';
import { RootStackParamList } from './types';
import { secureStorage } from '@/core/storage/secureStorage';
import { userService } from '@/features/profile/services/user.service';
import { mobilityService } from '@/features/mobility/services/mobility.service';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, role, setUser, clearAuth } = useAuthStore();
  const setActiveMobilityId = useMobilityStore((s) => s.setActiveMobilityId);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await secureStorage.getToken();
        if (token) {
          const user = await userService.getMe();
          setUser(user, token);
          const mobilities = await mobilityService.getAll();
          if (mobilities.length > 0) {
            setActiveMobilityId(mobilities[0].id);
          }
        }
      } catch {
        await clearAuth();
      } finally {
        setIsBootstrapping(false);
      }
    }
    void bootstrap();
  }, []);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
