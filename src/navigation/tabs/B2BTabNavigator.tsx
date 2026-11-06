import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarChart3, Bell, LayoutDashboard, Settings, Users } from 'lucide-react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors } from '@/design-system/tokens';
import {
  B2BDashboardScreen,
  StudentsScreen,
  AlertsScreen,
  StatsScreen,
  SettingsScreen,
} from '@/features/b2b';
import { B2BTabParamList } from '../types';

const Tab = createBottomTabNavigator<B2BTabParamList>();
const ICON_SIZE = 18;

function TabIcon({ icon, label, focused }: { icon: React.ReactNode; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      {icon}
      <Text numberOfLines={1} style={styles.tabLabel}>{label}</Text>
      <View style={focused ? styles.dot : styles.dotPlaceholder} />
    </View>
  );
}

const tab = (Icon: typeof Users, label: string) => ({
  tabBarAccessibilityLabel: label,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <TabIcon icon={<Icon size={ICON_SIZE} color={colors.darkBlue} />} label={label} focused={focused} />
  ),
});

export function B2BTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen name="B2BDashboard" component={B2BDashboardScreen} options={tab(LayoutDashboard, 'Dashboard')} />
      <Tab.Screen name="Students" component={StudentsScreen} options={tab(Users, 'Étudiants')} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={tab(Bell, 'Alertes')} />
      <Tab.Screen name="Stats" component={StatsScreen} options={tab(BarChart3, 'Stats')} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={tab(Settings, 'Réglages')} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 72, paddingBottom: 8, paddingTop: 4 },
  tabBarIcon: { height: 52, width: '100%' },
  tabItem: { alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: colors.darkBlue, fontFamily: 'DMSans_400Regular' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.darkBlue, marginTop: 2 },
  dotPlaceholder: { width: 4, height: 4, marginTop: 2 },
});
