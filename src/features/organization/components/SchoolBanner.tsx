import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { useAuthStore } from '@/features/auth/store/auth.store';

/** School branding (logo, primary color) for enrolled students. */
export function SchoolBanner() {
  const organization = useAuthStore((s) => s.user?.organization);
  if (!organization) return null;
  const color = organization.branding?.primary_color ?? colors.blue;
  return (
    <View style={[styles.banner, { backgroundColor: color }]} accessibilityLabel={`Accompagné par ${organization.name}`}>
      {organization.logoUrl ? (
        <Image source={{ uri: organization.logoUrl }} style={styles.logo} accessibilityIgnoresInvertColors />
      ) : (
        <Icon name="Building2" size={18} color={colors.white} />
      )}
      <Text variant="label" style={styles.text}>Accompagné·e par {organization.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logo: { width: 24, height: 24, borderRadius: 4, backgroundColor: colors.white },
  text: { color: colors.white, flex: 1 },
});
