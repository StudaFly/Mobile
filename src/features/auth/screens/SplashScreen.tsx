import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from '@/design-system/primitives/Text';
import { Icon } from '@/design-system/primitives/Icon';
import { Button } from '@/design-system/components/actions/Button';
import { colors, radii, spacing } from '@/design-system/tokens';
import { AuthStackParamList } from '@/navigation/types';
import { StudaFlyLogo } from '../components/StudaFlyLogo';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

interface FeatureItemProps {
  iconName: React.ComponentProps<typeof Icon>['name'];
  label: string;
}

function FeatureItem({ iconName, label }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconWrapper}>
        <Icon name={iconName} size={20} color={colors.gold} />
      </View>
      <Text variant="bodyMedium" style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

export function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <StudaFlyLogo size={100} />
          <Text variant="heading1" style={styles.title}>StudaFly</Text>
          <Text variant="body" style={styles.tagline}>Ton départ, bien préparé.</Text>
        </View>

        {/* Feature list */}
        <View style={styles.featuresCard}>
          <FeatureItem iconName="ClipboardList" label="Timeline personnalisée par destination" />
          <View style={styles.featureDivider} />
          <FeatureItem iconName="Wallet" label="Simulateur de budget réaliste" />
          <View style={styles.featureDivider} />
          <FeatureItem iconName="FolderOpen" label="Espace documents sécurisé" />
        </View>

        {/* CTAs */}
        <View style={styles.ctaSection}>
          <Button
            label="Commencer mon aventure →"
            fullWidth
            onPress={() => navigation.navigate('Register')}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text variant="caption" style={styles.loginLinkText}>
              Déjà un compte ?{' '}
              <Text variant="caption" style={styles.loginLinkUnderline}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.white,
    marginTop: spacing.sm,
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
  },
  featuresCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  featureIconWrapper: {
    width: 32,
    alignItems: 'center',
  },
  featureLabel: {
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
  featureDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ctaSection: {
    gap: spacing.md,
    alignItems: 'center',
  },
  loginLink: {
    paddingVertical: spacing.xs,
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.55)',
  },
  loginLinkUnderline: {
    color: colors.goldLight,
    textDecorationLine: 'underline',
  },
});
