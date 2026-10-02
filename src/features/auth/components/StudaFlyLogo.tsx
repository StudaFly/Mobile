import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface StudaFlyLogoProps {
  size?: number;
}

export function StudaFlyLogo({ size = 88 }: StudaFlyLogoProps) {
  const imageSize = size * 0.68;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.22 }]}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('../../../../assets/logo.png')}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
});
