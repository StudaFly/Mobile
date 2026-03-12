import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { Icon } from '@/design-system/primitives/Icon';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { colors, radii, spacing } from '@/design-system/tokens';
import { MobilityTypeCard } from '@/features/auth/components/MobilityTypeCard';
import { OnboardingStep } from '@/features/auth/components/OnboardingStep';
import { MobilityTypeOption } from '@/features/auth/types/auth.types';
import { B2CStackParamList } from '@/navigation/types';
import { useCreateMobility, TOTAL_CREATE_STEPS } from '../hooks/useCreateMobility';

interface MobilityOption {
  value: MobilityTypeOption;
  label: string;
  iconName: React.ComponentProps<typeof Icon>['name'];
}

const MOBILITY_OPTIONS: MobilityOption[] = [
  { value: 'erasmus', label: 'Erasmus', iconName: 'Globe' },
  { value: 'stage', label: 'Stage', iconName: 'Briefcase' },
  { value: 'semestre', label: 'Semestre', iconName: 'BookOpen' },
  { value: 'double_diplome', label: 'Double diplôme', iconName: 'GraduationCap' },
];

const STEP_CONFIG = [
  { title: 'Ton type de mobilité', subtitle: 'Quel programme as-tu choisi ?' },
  { title: 'Ta destination', subtitle: 'Vers quelle ville pars-tu ?' },
  { title: 'Ta date de départ', subtitle: 'Quand commence ton aventure ?' },
  { title: 'Ton établissement', subtitle: 'Dans quelle école arrives-tu ?' },
];

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

interface DateFieldProps {
  value: string;
  onChange: (formatted: string) => void;
}

function DateField({ value, onChange }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (selected) {
      setDate(selected);
      onChange(formatDate(selected));
    }
  };

  return (
    <View>
      <Pressable style={styles.dateField} onPress={() => setShow(true)}>
        <Text style={[styles.dateFieldText, !value && styles.dateFieldPlaceholder]}>
          {value || 'jj/mm/aaaa'}
        </Text>
        <Icon name="Calendar" size={20} color="rgba(255,255,255,0.6)" />
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          textColor={Platform.OS === 'ios' ? 'white' : undefined}
          minimumDate={new Date()}
          onChange={handleChange}
        />
      )}
      {show && Platform.OS === 'ios' && (
        <Pressable style={styles.dateConfirmBtn} onPress={() => setShow(false)}>
          <Text style={styles.dateConfirmText}>Valider</Text>
        </Pressable>
      )}
    </View>
  );
}

export function CreateMobilityScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<B2CStackParamList>>();

  const { step, data, next, prev, updateData, isLastStep, canProceed, createMobility, isCreating, creationError, totalSteps } =
    useCreateMobility(() => navigation.goBack());

  const config = STEP_CONFIG[step];

  const handleNext = () => {
    if (isLastStep) {
      createMobility();
    } else {
      next();
    }
  };

  const errorMessage = creationError instanceof Error
    ? creationError.message
    : creationError ? 'Une erreur est survenue. Réessaie.' : null;

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="X" size={22} color="rgba(255,255,255,0.8)" />
        </Pressable>
        <Text variant="label" style={styles.topBarTitle}>Nouvelle mobilité</Text>
        <View style={styles.closeButton} />
      </View>

      {/* Progress dots */}
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotActive, i === step && styles.dotCurrent]} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OnboardingStep title={config.title} subtitle={config.subtitle}>
          {step === 0 && (
            <View style={styles.mobilityGrid}>
              {MOBILITY_OPTIONS.map((option) => (
                <MobilityTypeCard
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  iconName={option.iconName}
                  selected={data.mobilityType === option.value}
                  onSelect={(v) => updateData('mobilityType', v)}
                />
              ))}
            </View>
          )}

          {step === 1 && (
            <TextInput
              placeholder="ex: Barcelone, Berlin, Montréal…"
              value={data.destination}
              onChangeText={(v) => updateData('destination', v)}
              autoCapitalize="words"
              style={styles.inputLight}
            />
          )}

          {step === 2 && (
            <View style={styles.dateStepWrapper}>
              <DateField
                value={data.departureDate}
                onChange={(v) => updateData('departureDate', v)}
              />
              <View style={styles.dateHint}>
                <Icon name="Lightbulb" size={16} color={colors.goldLight} />
                <Text style={styles.dateHintText}>
                  On calculera automatiquement toutes tes deadlines à partir de cette date.
                </Text>
              </View>
            </View>
          )}

          {step === 3 && (
            <TextInput
              placeholder="ex: Universitat de Barcelona"
              value={data.school}
              onChangeText={(v) => updateData('school', v)}
              autoCapitalize="words"
              style={styles.inputLight}
              hint="Optionnel — tu pourras le renseigner plus tard"
            />
          )}
        </OnboardingStep>

        <Text variant="caption" style={styles.stepCounter}>
          Étape {step + 1} sur {TOTAL_CREATE_STEPS}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Button label="Retour" variant="ghost" onPress={prev} />
        )}
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <Button
          label={isCreating ? 'Création...' : isLastStep ? "C'est parti !" : 'Suivant'}
          iconRight="ArrowRight"
          onPress={handleNext}
          disabled={!canProceed() || isCreating}
          style={styles.nextButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.darkBlue,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: colors.white,
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: 'rgba(204,156,64,0.5)',
  },
  dotCurrent: {
    backgroundColor: colors.gold,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  mobilityGrid: {
    gap: spacing.sm,
  },
  inputLight: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.25)',
    color: colors.white,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    minHeight: 52,
  },
  dateFieldText: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  dateFieldPlaceholder: {
    color: 'rgba(255,255,255,0.4)',
  },
  dateConfirmBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gold,
    borderRadius: radii.md,
  },
  dateConfirmText: {
    color: colors.white,
    fontWeight: '600',
  },
  stepCounter: {
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  dateStepWrapper: {
    gap: spacing.md,
  },
  dateHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(204,156,64,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204,156,64,0.3)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  dateHintText: {
    color: colors.goldLight,
    fontSize: 13,
  },
});
