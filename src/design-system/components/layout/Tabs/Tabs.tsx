import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
interface TabsProps { children: React.ReactNode; }
export function Tabs({ children }: TabsProps) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>{children}</ScrollView>;
}
const styles = StyleSheet.create({ container: { flexGrow: 0 } });
