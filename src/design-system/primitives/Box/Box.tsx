import React from 'react';
import { View, ViewProps } from 'react-native';
import { spacing, Spacing } from '@/design-system/tokens';

interface BoxProps extends ViewProps {
  padding?: Spacing;
  paddingHorizontal?: Spacing;
  paddingVertical?: Spacing;
  margin?: Spacing;
  marginHorizontal?: Spacing;
  marginVertical?: Spacing;
  flex?: number;
  gap?: Spacing;
  backgroundColor?: string;
}

export function Box({
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  flex,
  gap,
  backgroundColor,
  style,
  ...props
}: BoxProps) {
  return (
    <View
      style={[
        padding !== undefined && { padding: spacing[padding] },
        paddingHorizontal !== undefined && { paddingHorizontal: spacing[paddingHorizontal] },
        paddingVertical !== undefined && { paddingVertical: spacing[paddingVertical] },
        margin !== undefined && { margin: spacing[margin] },
        marginHorizontal !== undefined && { marginHorizontal: spacing[marginHorizontal] },
        marginVertical !== undefined && { marginVertical: spacing[marginVertical] },
        flex !== undefined && { flex },
        gap !== undefined && { gap: spacing[gap] },
        backgroundColor ? { backgroundColor } : undefined,
        style,
      ]}
      {...props}
    />
  );
}
