import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { OAuthProvider } from '../types/auth.types';
import { OAuthLogo } from './OAuthLogo';

// Couleurs brand OAuth — hors palette StudaFly, constantes ici par exception
const GOOGLE_BORDER = 'rgba(33,52,88,0.12)';
const APPLE_BG = '#000000';
const MICROSOFT_BG = '#0078D4';

interface OAuthButtonConfig {
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

const PROVIDER_CONFIG: Record<OAuthProvider, OAuthButtonConfig> = {
  google: {
    label: 'Continuer avec Google',
    backgroundColor: colors.white,
    textColor: colors.darkBlue,
    borderColor: GOOGLE_BORDER,
  },
  apple: {
    label: 'Continuer avec Apple',
    backgroundColor: APPLE_BG,
    textColor: colors.white,
  },
  microsoft: {
    label: 'Continuer avec Microsoft',
    backgroundColor: MICROSOFT_BG,
    textColor: colors.white,
  },
};

interface OAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  isLoading?: boolean;
}

export function OAuthButton({ provider, onPress, isLoading = false }: OAuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];

  return (
    <TouchableScale
      onPress={onPress}
      disabled={isLoading}
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        config.borderColor ? { borderWidth: 1, borderColor: config.borderColor } : undefined,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={config.textColor} size="small" />
      ) : (
        <>
          <View style={styles.iconWrapper}>
            <OAuthLogo provider={provider} size={22} />
          </View>
          <Text variant="bodyMedium" style={[styles.label, { color: config.textColor }]}>
            {config.label}
          </Text>
        </>
      )}
    </TouchableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 7, // 15px — valeur maquette
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    minHeight: 52,
    ...shadows.sm,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
  },
});
