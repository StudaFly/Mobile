import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { IconButton } from '@/design-system/components/actions/IconButton';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import type { B2CNavigationProp } from '@/navigation/types';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { useReference } from '@/core/reference';
import { splitName, useProfile } from '../hooks/useProfile';

export function EditProfileScreen() {
  const navigation = useNavigation<B2CNavigationProp>();
  const { user, updateProfile } = useProfile();
  const { avatarEmojis } = useReference();
  const initialName = splitName(user?.name ?? '');

  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarEmoji, setAvatarEmoji] = useState(user?.avatarEmoji ?? '🎓');

  const canSave = firstName.trim().length > 0 && !updateProfile.isPending;

  const handleSave = () => {
    updateProfile.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        avatarEmoji,
      },
      { onSuccess: () => navigation.goBack() },
    );
  };

  return (
    <ScreenWrapper style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          iconName="ArrowLeft"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Retour"
          accessibilityRole="button"
        />
        <Text variant="heading3" style={styles.title} accessibilityRole="header">Modifier mon profil</Text>
        <Button label="Sauvegarder" onPress={handleSave} disabled={!canSave} isLoading={updateProfile.isPending} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <View style={styles.avatarBackdrop}>
            <ProfileAvatar emoji={avatarEmoji} size={88} />
          </View>
          <Text variant="label" style={styles.label}>Choisis ton avatar</Text>
          <View style={styles.emojiGrid}>
            {avatarEmojis.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiItem, avatarEmoji === emoji && styles.emojiSelected]}
                onPress={() => setAvatarEmoji(emoji)}
                accessibilityRole="button"
                accessibilityState={{ selected: avatarEmoji === emoji }}
                accessibilityLabel={`Avatar ${emoji}`}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput label="Prénom" value={firstName} onChangeText={setFirstName} autoCapitalize="words" autoComplete="given-name" />
        <TextInput label="Nom" value={lastName} onChangeText={setLastName} autoCapitalize="words" autoComplete="family-name" />
        <TextInput label="Email" value={user?.email ?? ''} editable={false} hint="L'email ne peut pas être modifié." />
        <TextInput
          label="Téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={20}
          placeholder="+33 6 12 34 56 78"
        />

        {updateProfile.error ? (
          <Text variant="caption" style={styles.error} accessibilityRole="alert">
            {getApiErrorMessage(updateProfile.error)}
          </Text>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  title: { flex: 1, color: colors.darkBlue },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: 'center', gap: spacing.sm },
  avatarBackdrop: { backgroundColor: colors.darkBlue, borderRadius: radii.full, padding: 4 },
  label: { color: '#6B7280' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  emojiItem: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelected: { borderColor: colors.blue, backgroundColor: '#EEF2FF' },
  emoji: { fontSize: 24, lineHeight: 30 },
  error: { color: colors.danger },
});
