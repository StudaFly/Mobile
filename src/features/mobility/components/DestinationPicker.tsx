import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import { useDestinationSearch } from '../hooks/useDestinationSearch';
import type { DestinationSearchResult } from '../services/mobility.service';
import { formatDestination } from '../utils';

const MAX_SUGGESTIONS = 6;

interface DestinationPickerProps {
  value: string;
  selectedId: string | null;
  onChangeText: (text: string) => void;
  onSelect: (destination: DestinationSearchResult) => void;
  inputStyle?: StyleProp<TextStyle>;
}

export function DestinationPicker({ value, selectedId, onChangeText, onSelect, inputStyle }: DestinationPickerProps) {
  const search = useDestinationSearch(selectedId ? '' : value);
  const suggestions = (search.data ?? []).slice(0, MAX_SUGGESTIONS);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ex : Barcelone, Berlin, Lisbonne…"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        autoCorrect={false}
        style={inputStyle}
        accessibilityLabel="Rechercher une destination"
      />

      {selectedId ? (
        <View style={styles.selected} accessibilityLiveRegion="polite">
          <Icon name="Check" size={16} color={colors.success} />
          <Text variant="caption" style={styles.selectedText}>Destination sélectionnée</Text>
        </View>
      ) : search.isLoading ? (
        <ActivityIndicator color={colors.white} style={styles.loader} />
      ) : search.isError ? (
        <Text variant="caption" style={styles.message}>{getApiErrorMessage(search.error)}</Text>
      ) : suggestions.length === 0 ? (
        <Text variant="caption" style={styles.message}>
          Aucune destination trouvée. StudaFly couvre pour l'instant une sélection de villes européennes.
        </Text>
      ) : (
        <View style={styles.list} accessibilityRole="list">
          {suggestions.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.item}
              onPress={() => onSelect(destination)}
              accessibilityRole="button"
              accessibilityLabel={`Choisir ${formatDestination(destination)}`}
            >
              <Icon name="MapPin" size={16} color={colors.goldLight} />
              <Text variant="body" style={styles.itemCity}>{destination.city}</Text>
              <Text variant="caption" style={styles.itemCountry}>{destination.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  loader: { marginTop: spacing.sm },
  message: { color: 'rgba(255,255,255,0.7)' },
  selected: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  selectedText: { color: colors.success },
  list: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  itemCity: { color: colors.white },
  itemCountry: { color: 'rgba(255,255,255,0.6)' },
});
