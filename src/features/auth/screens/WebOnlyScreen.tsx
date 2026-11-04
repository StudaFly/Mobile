import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button } from '@/design-system/components/actions/Button';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';
import { env } from '@/core/config/env';
import { logout } from '../session';

export function WebOnlyScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Icon name="Monitor" size={48} color={colors.blue} />
        <Text variant="heading3" style={styles.title} accessibilityRole="header">Administration sur le web</Text>
        <Text variant="body" style={styles.text}>
          L'administration de la plateforme se fait uniquement depuis le site web, avec la double authentification.
        </Text>
        <Button label="Ouvrir l'administration" onPress={() => void Linking.openURL(`${env.WEB_URL}/admin`)} fullWidth />
        <Button label="Se déconnecter" variant="ghost" onPress={() => void logout()} fullWidth />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  title: { color: colors.darkBlue, textAlign: 'center' },
  text: { color: '#374151', textAlign: 'center' },
});
