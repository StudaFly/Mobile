import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { typography, colors } from '@/design-system/tokens';
import { TextProps } from './Text.types';

export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        typography.variants[variant],
        color ? { color } : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily,
    color: colors.darkBlue,
  },
});
