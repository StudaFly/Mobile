import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StepperProps {
  totalSteps: number;
  currentStep: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Stepper(_props: StepperProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({ container: { flexDirection: 'row', gap: 8 } });
