import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Icon } from '@/design-system/primitives/Icon';
import { PressableProps } from 'react-native';

interface IconButtonProps extends PressableProps {
  iconName: string;
  size?: number;
  color?: string;
}

export function IconButton({ iconName, size = 24, color, ...props }: IconButtonProps) {
  return (
    <TouchableScale style={styles.container} {...props}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
