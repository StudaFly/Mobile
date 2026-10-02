import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii } from '@/design-system/tokens';

interface ProfileAvatarProps {
  emoji?: string | null;
  size?: number;
}

export function ProfileAvatar({ emoji, size = 80 }: ProfileAvatarProps) {
  return (
    <View
      style={[styles.circle, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel="Avatar"
    >
      <Text style={{ fontSize: size * 0.45, lineHeight: size * 0.6 }}>{emoji || '🎓'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: radii.full,
    borderWidth: 3,
    borderColor: colors.goldLight,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
