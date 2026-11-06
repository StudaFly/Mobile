import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore, WebOnlyScreen } from '@/features/auth';
import { InvitationScreen, useInvitationStore } from '@/features/organization';
import { AuthStack } from './stacks/AuthStack';
import { B2CStack } from './stacks/B2CStack';
import { B2BStack } from './stacks/B2BStack';
import { linking } from './linking';
import { RootStackParamList } from './types';
import { secureStorage } from '@/core/storage/secureStorage';
import { onSessionExpired } from '@/core/api/client';
import { getApiErrorStatus } from '@/core/api/errors';
import { clearLocalSession } from '@/features/auth/session';
import { userService } from '@/features/profile/services/user.service';
import { mobilityService } from '@/features/mobility/services/mobility.service';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, accountType, setUser } = useAuthStore();
  const pendingInvitation = useInvitationStore((s) => s.pendingToken);
  const setActiveMobilityId = useMobilityStore((s) => s.setActiveMobilityId);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => onSessionExpired(clearLocalSession), []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await secureStorage.getToken();
        if (token) {
          const user = await userService.getMe();
          setUser(user, token);
          if ((user.accountType ?? 'student') === 'student') {
            const mobilities = await mobilityService.getAll();
            if (mobilities.length > 0) {
              setActiveMobilityId(mobilities[0].id);
            }
          }
        }
      } catch (err) {
        const status = getApiErrorStatus(err);
        if (status === 401 || status === 403) clearLocalSession();
      } finally {
        setIsBootstrapping(false);
      }
    }
    void bootstrap();
  }, []);

  useEffect(() => {
    if (isAuthenticated && pendingInvitation && navigationRef.isReady()) {
      navigationRef.navigate('Invitation', { token: pendingInvitation });
    }
  }, [isAuthenticated, pendingInvitation]);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : accountType === 'platform_admin' ? (
          <Stack.Screen name="WebOnly" component={WebOnlyScreen} />
        ) : accountType === 'org_staff' ? (
          <Stack.Screen name="B2B" component={B2BStack} />
        ) : (
          <Stack.Screen name="B2C" component={B2CStack} />
        )}
        <Stack.Screen name="Invitation" component={InvitationScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
