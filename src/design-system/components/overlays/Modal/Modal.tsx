import React from 'react';
import { Modal as RNModal, StyleSheet, View } from 'react-native';
interface ModalProps { visible: boolean; onClose: () => void; children?: React.ReactNode; }
export function Modal({ visible, onClose, children }: ModalProps) {
  return <RNModal visible={visible} onRequestClose={onClose} transparent animationType="fade"><View style={styles.overlay}>{children}</View></RNModal>;
}
const styles = StyleSheet.create({ overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' } });
