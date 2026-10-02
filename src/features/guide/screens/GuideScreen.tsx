import React from 'react';
import { Linking, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Skeleton } from '@/design-system/components/feedback/Skeleton';
import { IconButton } from '@/design-system/components/actions/IconButton';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import type { B2CNavigationProp } from '@/navigation/types';
import { useGuide } from '../hooks/useGuide';
import { GuideSectionCard } from '../components/GuideSectionCard';

const PHONE_NUMBER = /^\+?[\d\s.-]{2,}$/;

export function GuideScreen() {
  const navigation = useNavigation<B2CNavigationProp>();
  const { data: guide, mobility, isLoading, isError, error, refetch, isRefetching } = useGuide();

  const header = (
    <View style={styles.header}>
      <IconButton
        iconName="ArrowLeft"
        color={colors.white}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Retour"
        accessibilityRole="button"
      />
      <View style={styles.headerText}>
        <Text variant="caption" style={styles.headerCaption}>Guide de destination</Text>
        <Text variant="heading2" style={styles.headerTitle} accessibilityRole="header">
          {guide?.city ?? 'Guide'}
        </Text>
        {guide ? <Text variant="caption" style={styles.headerCaption}>{guide.country}</Text> : null}
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );

  if (!isLoading && !mobility) {
    return (
      <ScreenWrapper style={styles.screen}>
        {header}
        <EmptyState
          title="Aucune mobilité configurée"
          message="Configure ta mobilité pour découvrir le guide de ta destination."
          ctaLabel="Créer ma mobilité"
          onCta={() => navigation.navigate('CreateMobility')}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.screen}>
      {header}
      {isLoading ? (
        <View style={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} style={styles.skeletonItem} />
          ))}
        </View>
      ) : isError || !guide ? (
        <EmptyState
          title="Guide indisponible"
          message={getApiErrorMessage(error, "Pas encore de guide pour cette destination.")}
          ctaLabel="Réessayer"
          onCta={() => void refetch()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {guide.sections.map((section) => (
            <GuideSectionCard key={section.key} section={section} />
          ))}

          {guide.keySteps.length > 0 && (
            <View style={styles.card}>
              <Text variant="bodyMedium" style={styles.cardTitle} accessibilityRole="header">🗓️ Étapes clés</Text>
              {guide.keySteps.map((step) => (
                <View key={step.title} style={styles.stepRow}>
                  <View style={styles.stepTiming}>
                    <Text variant="caption" style={styles.stepTimingText}>{step.timing}</Text>
                  </View>
                  <View style={styles.stepText}>
                    <Text variant="bodyMedium" style={styles.cardTitle}>{step.title}</Text>
                    <Text variant="body" style={styles.tipText}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {guide.tips.length > 0 && (
            <View style={[styles.card, styles.tipsCard]}>
              <Text variant="bodyMedium" style={styles.cardTitle} accessibilityRole="header">💡 Bons plans</Text>
              {guide.tips.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <Text variant="body" style={styles.bullet}>•</Text>
                  <Text variant="body" style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {Object.keys(guide.emergencyContacts).length > 0 && (
            <View style={styles.card}>
              <Text variant="bodyMedium" style={styles.cardTitle} accessibilityRole="header">🚨 Contacts utiles</Text>
              {Object.entries(guide.emergencyContacts).map(([label, value]) => {
                const callable = PHONE_NUMBER.test(value);
                return (
                  <TouchableOpacity
                    key={label}
                    style={styles.contactRow}
                    disabled={!callable}
                    onPress={() => void Linking.openURL(`tel:${value.replace(/[\s.-]/g, '')}`)}
                    accessibilityRole={callable ? 'button' : 'text'}
                    accessibilityLabel={callable ? `Appeler ${label} : ${value}` : `${label} : ${value}`}
                  >
                    <Text variant="body" style={styles.contactLabel}>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
                    <View style={styles.contactValue}>
                      {callable ? <Icon name="Phone" size={14} color={colors.blue} /> : null}
                      <Text variant="bodyMedium" style={[styles.contactText, callable && styles.contactLink]}>{value}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  headerText: { flex: 1, alignItems: 'center', gap: 2 },
  headerCaption: { color: 'rgba(255,255,255,0.7)' },
  headerTitle: { color: colors.white },
  headerSpacer: { width: 40 },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm, ...shadows.sm },
  tipsCard: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1 },
  cardTitle: { color: colors.darkBlue, fontWeight: '700' },
  tipRow: { flexDirection: 'row', gap: spacing.sm },
  stepRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  stepTiming: { backgroundColor: '#FFF7E0', borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  stepTimingText: { color: colors.darkBlue, fontWeight: '600' },
  stepText: { flex: 1, gap: 2 },
  bullet: { color: colors.gold },
  tipText: { color: '#4B5563', flex: 1 },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 44,
  },
  contactLabel: { color: '#4B5563', flexShrink: 1 },
  contactValue: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  contactText: { color: colors.darkBlue, textAlign: 'right' },
  contactLink: { color: colors.blue },
  skeletonItem: { height: 96, borderRadius: radii.lg },
});
