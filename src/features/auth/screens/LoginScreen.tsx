import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { colors, radii, spacing } from '@/design-system/tokens';
import { AuthStackParamList } from '@/navigation/types';
import { OAuthButton } from '../components/OAuthButton';
import { StudaFlyLogo } from '../components/StudaFlyLogo';
import { useLogin, useOAuthLogin, useRegister } from '../hooks/useLogin';
import { OAuthProvider } from '../types/auth.types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type Tab = 'login' | 'register';

const DARK_PLACEHOLDER_COLOR = 'rgba(255,255,255,0.55)';

const OAUTH_PROVIDERS: OAuthProvider[] = ['google', 'apple', 'microsoft'];

export function LoginScreen({ navigation, route }: Props) {
  const initialTab = route.params?.initialTab ?? 'login';
  const [tab, setTab] = useState<Tab>(initialTab);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { mutate: login, isPending: loginPending, error: loginError } = useLogin();
  const { mutate: oauthLogin, isPending: oauthPending } = useOAuthLogin();
  const { mutate: register, isPending: registerPending, isSuccess: registerSuccess } = useRegister();

  const isAnyLoading = loginPending || oauthPending || registerPending;

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    login({ email: loginEmail.trim(), password: loginPassword });
  };

  const handleRegister = () => {
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) return;
    register(
      { name: registerName.trim(), email: registerEmail.trim(), password: registerPassword },
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
        {/* Header */}
        <View style={styles.header}>
          <StudaFlyLogo size={72} />
          <Text variant="heading1" style={styles.title}>StudaFly</Text>
          <Text variant="body" style={styles.subtitle}>
            {tab === 'login' ? 'Bon retour parmi nous !' : 'Crée ton compte gratuitement'}
          </Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => setTab('login')}
          >
            <Text variant="label" style={[styles.tabLabel, tab === 'login' && styles.tabLabelActive]}>
              Connexion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'register' && styles.tabActive]}
            onPress={() => setTab('register')}
          >
            <Text variant="label" style={[styles.tabLabel, tab === 'register' && styles.tabLabelActive]}>
              Inscription
            </Text>
          </TouchableOpacity>
        </View>

        {/* OAuth */}
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

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text variant="caption" style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        {tab === 'login' ? (
          <View style={styles.form}>
            <TextInput
              label="Email"
              placeholder="ton@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              style={styles.inputDark}
              placeholderTextColor={DARK_PLACEHOLDER_COLOR}
            />
            <TextInput
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={loginPassword}
              onChangeText={setLoginPassword}
              style={styles.inputDark}
              placeholderTextColor={DARK_PLACEHOLDER_COLOR}
              error={loginError ? 'Email ou mot de passe incorrect' : undefined}
            />
            <Button
              label="Se connecter"
              fullWidth
              isLoading={loginPending}
              onPress={handleLogin}
              disabled={isAnyLoading || !loginEmail.trim() || !loginPassword.trim()}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              label="Prénom et nom"
              placeholder="Lucas Martin"
              autoCapitalize="words"
              autoComplete="name"
              value={registerName}
              onChangeText={setRegisterName}
              style={styles.inputDark}
              placeholderTextColor={DARK_PLACEHOLDER_COLOR}
            />
            <TextInput
              label="Email"
              placeholder="ton@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              style={styles.inputDark}
              placeholderTextColor={DARK_PLACEHOLDER_COLOR}
            />
            <TextInput
              label="Mot de passe"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              value={registerPassword}
              onChangeText={setRegisterPassword}
              style={styles.inputDark}
              placeholderTextColor={DARK_PLACEHOLDER_COLOR}
            />
            <Button
              label="Créer mon compte"
              fullWidth
              isLoading={registerPending}
              onPress={handleRegister}
              disabled={isAnyLoading || !registerName.trim() || !registerEmail.trim() || !registerPassword.trim()}
            />
          </View>
        )}
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabActive: {
    backgroundColor: colors.gold,
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.55)',
  },
  tabLabelActive: {
    color: colors.white,
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
});
