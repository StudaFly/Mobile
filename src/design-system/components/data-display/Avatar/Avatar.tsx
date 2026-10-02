import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors } from '@/design-system/tokens';

interface AvatarProps { uri?: string; initials?: string; size?: number; }

export function Avatar({ uri, initials = '?', size = 40 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} /> : (
        <Text variant="label" style={styles.initials}>{initials}</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { color: colors.white },
});
