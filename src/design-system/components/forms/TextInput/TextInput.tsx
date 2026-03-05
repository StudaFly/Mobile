import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing, radii } from '@/design-system/tokens';
import { TextInputProps } from './TextInput.types';

export function TextInput({ label, error, hint, style, ...props }: TextInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text variant="label" style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={colors.blue}
        {...props}
      />
      {error && <Text variant="caption" style={styles.error}>{error}</Text>}
      {hint && !error && <Text variant="caption" style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { color: colors.darkBlue },
  input: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.darkBlue,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger },
  hint: { color: colors.blue },
});
