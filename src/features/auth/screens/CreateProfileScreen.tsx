import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { colors, radii, spacing } from '@/design-system/tokens';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreateProfile'>;

const AVATAR_EMOJIS = ['🎓', '✈️', '🌍', '📚', '🏃', '🎨', '🎸', '🍕', '🌊', '🦁'];

export function CreateProfileScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setSelectedEmoji(null);
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setPhotoUri(null);
  };

  const handleContinue = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading2" style={styles.title}>Crée ton profil</Text>
          <Text variant="body" style={styles.subtitle}>
            Personnalise ton espace StudaFly
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : selectedEmoji ? (
              <Text style={styles.avatarEmoji}>{selectedEmoji}</Text>
            ) : (
              <Text style={styles.avatarPlaceholder}>📷</Text>
            )}
          </TouchableOpacity>
          <Text variant="caption" style={styles.photoHint}>Appuie pour choisir une photo</Text>

          <Text variant="label" style={styles.emojiLabel}>Ou choisis un avatar</Text>
          <View style={styles.emojiGrid}>
            {AVATAR_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[styles.emojiItem, selectedEmoji === emoji && styles.emojiItemSelected]}
                onPress={() => handleSelectEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label="Prénom *"
            placeholder="Lucas"
            autoCapitalize="words"
            autoComplete="given-name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            label="Nom *"
            placeholder="Martin"
            autoCapitalize="words"
            autoComplete="family-name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            label="Téléphone (optionnel)"
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            label="Établissement (optionnel)"
            placeholder="Université de Paris"
            autoCapitalize="words"
            value={institution}
            onChangeText={setInstitution}
          />

          {/* Notifications toggle */}
          <View style={styles.notifRow}>
            <View style={styles.notifText}>
              <Text variant="label" style={styles.notifTitle}>Activer les notifications</Text>
              <Text variant="caption" style={styles.notifDescription}>
                Reçois des rappels pour tes échéances importantes
              </Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: colors.bgB2B, true: colors.gold }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Button
          label="Continuer"
          fullWidth
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.darkBlue,
  },
  subtitle: {
    color: colors.blue,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoButton: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.bgB2B,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blue,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
  },
  avatarEmoji: {
    fontSize: 48,
    lineHeight: 60,
  },
  avatarPlaceholder: {
    fontSize: 36,
    lineHeight: 46,
  },
  photoHint: {
    color: colors.blue,
  },
  emojiLabel: {
    color: colors.darkBlue,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  emojiItem: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.bgB2B,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiItemSelected: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(204,156,64,0.1)',
  },
  emojiText: {
    fontSize: 24,
    lineHeight: 34,
  },
  form: {
    gap: spacing.md,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  notifText: {
    flex: 1,
    gap: spacing.xs,
  },
  notifTitle: {
    color: colors.darkBlue,
  },
  notifDescription: {
    color: colors.blue,
  },
});
