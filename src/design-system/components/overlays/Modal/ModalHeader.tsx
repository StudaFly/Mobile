import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { IconButton } from '@/design-system/components/actions/IconButton';
interface ModalHeaderProps { title: string; onClose: () => void; }
export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return <View style={styles.container}><Text variant="heading3">{title}</Text><IconButton iconName="X" onPress={onClose} /></View>;
}
const styles = StyleSheet.create({ container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } });
