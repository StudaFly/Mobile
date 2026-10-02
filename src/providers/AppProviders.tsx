import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { NotificationProvider } from './NotificationProvider';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ApiStatusBanner } from './ApiStatusBanner';

export function AppProviders() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <NotificationProvider>
              <RootNavigator />
              <ApiStatusBanner />
            </NotificationProvider>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
