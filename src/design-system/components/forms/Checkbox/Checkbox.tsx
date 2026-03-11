import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { colors } from '@/design-system/tokens';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
  disabled?: boolean;
}

export function Checkbox({ checked, onPress, size = 24, disabled = false }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.touchable, { width: size, height: size }]}
    >
      <View
        style={[
          styles.box,
          { width: size, height: size, borderRadius: Math.round(size * 0.33) },
          checked ? styles.checked : styles.unchecked,
          disabled && styles.disabled,
        ]}
      >
        {checked && (
          <Icon name="Check" size={Math.round(size * 0.65)} color={colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  unchecked: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  disabled: {
    opacity: 0.5,
  },
});
