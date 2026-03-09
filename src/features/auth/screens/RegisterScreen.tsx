import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { colors, spacing } from '@/design-system/tokens';
import { AuthStackParamList } from '@/navigation/types';
import { OAuthButton } from '../components/OAuthButton';
import { StudaFlyLogo } from '../components/StudaFlyLogo';
import { useOAuthLogin, useRegister } from '../hooks/useLogin';
import { OAuthProvider } from '../types/auth.types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const DARK_PLACEHOLDER_COLOR = 'rgba(255,255,255,0.55)';
const OAUTH_PROVIDERS: OAuthProvider[] = ['google', 'apple', 'microsoft'];

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: oauthLogin, isPending: oauthPending } = useOAuthLogin();
  const { mutate: register, isPending: registerPending, isSuccess: registerSuccess } = useRegister();

  const isAnyLoading = oauthPending || registerPending;

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    register(
      { name: name.trim(), email: email.trim(), password },
      { onSuccess: () => navigation.navigate('CreateProfile') },
    );
  };

  const handleOAuth = (provider: OAuthProvider) => {
    oauthLogin({ provider, mockToken: `mock-${provider}-token` });
  };

  useEffect(() => {
    if (registerSuccess) {
      navigation.navigate('CreateProfile');
    }
  }, [registerSuccess, navigation]);

  return (
    <ScreenWrapper style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <StudaFlyLogo size={72} />
          <Text variant="heading1" style={styles.title}>StudaFly</Text>
          <Text variant="body" style={styles.subtitle}>Crée ton compte gratuitement</Text>
        </View>

        <View style={styles.oauthSection}>
          {OAUTH_PROVIDERS.map((provider) => (
            <OAuthButton
              key={provider}
              provider={provider}
              onPress={() => handleOAuth(provider)}
              isLoading={oauthPending}
            />
          ))}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text variant="caption" style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.form}>
          <TextInput
            label="Prénom et nom"
            placeholder="Lucas Martin"
            autoCapitalize="words"
            autoComplete="name"
            value={name}
            onChangeText={setName}
            style={styles.inputDark}
            placeholderTextColor={DARK_PLACEHOLDER_COLOR}
          />
          <TextInput
            label="Email"
            placeholder="ton@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            style={styles.inputDark}
            placeholderTextColor={DARK_PLACEHOLDER_COLOR}
          />
          <TextInput
            label="Mot de passe"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
            style={styles.inputDark}
            placeholderTextColor={DARK_PLACEHOLDER_COLOR}
          />
          <Button
            label="Créer mon compte"
            fullWidth
            isLoading={registerPending}
            onPress={handleRegister}
            disabled={isAnyLoading || !name.trim() || !email.trim() || !password.trim()}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchLink}>
          <Text variant="caption" style={styles.switchText}>
            Déjà un compte ?{' '}
            <Text variant="caption" style={styles.switchTextAccent}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.darkBlue,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    color: colors.white,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  oauthSection: {
    gap: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.45)',
  },
  form: {
    gap: spacing.md,
  },
  inputDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.2)',
    color: colors.white,
  },
  switchLink: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  switchText: {
    color: 'rgba(255,255,255,0.55)',
  },
  switchTextAccent: {
    color: colors.goldLight,
    textDecorationLine: 'underline',
  },
});
