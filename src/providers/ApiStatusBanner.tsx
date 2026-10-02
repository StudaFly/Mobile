import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '@/core/api/client';
import { env, type ApiUrlSource } from '@/core/config/env';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';

const SOURCE_HINT: Record<ApiUrlSource, string> = {
  'metro-host':
    "Le téléphone doit être sur le même réseau que l'ordinateur. Sur un réseau d'école (appareils isolés), lance `pnpm start:tunnel`.",
  env: 'URL fixée par EXPO_PUBLIC_API_URL : vérifie-la (mobile/.env) ou relance `pnpm start:tunnel`.',
  localhost: "« localhost » ne désigne pas l'ordinateur depuis un téléphone : lance `pnpm start:tunnel`.",
  'app-config': "URL fixée dans la configuration de l'app (extra.BASE_URL).",
};

const SERVICE_NAMES: Record<string, string> = { database: 'PostgreSQL', cache: 'Redis' };

function describe(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 503) {
    const details = (error.response.data as { error?: { details?: Record<string, string> } })?.error?.details ?? {};
    const down = Object.entries(details)
      .filter(([, state]) => state !== 'ok')
      .map(([name]) => SERVICE_NAMES[name] ?? name);
    return `L'API répond, mais ${down.join(' et ') || 'un service'} est injoignable. Lance \`make services\` dans backend/.`;
  }
  return `Impossible de joindre l'API (${env.BASE_URL}). ${SOURCE_HINT[env.BASE_URL_SOURCE]}`;
}

export function ApiStatusBanner() {
  const insets = useSafeAreaInsets();
  const health = useQuery({
    queryKey: ['api-health'],
    queryFn: () => apiClient.get('/health', { timeout: 5_000 }),
    retry: false,
    staleTime: 30_000,
    refetchInterval: (query) => (query.state.status === 'error' ? 10_000 : false),
  });

  if (!health.isError) return null;

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.xs }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.banner}
        onPress={() => void health.refetch()}
        accessibilityRole="alert"
        accessibilityHint="Touche pour réessayer"
      >
        <Text variant="caption" style={styles.text}>
          ⚠️ {describe(health.error)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, paddingHorizontal: spacing.sm },
  banner: { backgroundColor: colors.danger, borderRadius: 10, padding: spacing.sm },
  text: { color: colors.white },
});
