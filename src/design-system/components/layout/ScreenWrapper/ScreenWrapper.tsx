import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/design-system/tokens';
interface ScreenWrapperProps extends ViewProps { children: React.ReactNode; }
export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.bg }, flex: { flex: 1 } });
