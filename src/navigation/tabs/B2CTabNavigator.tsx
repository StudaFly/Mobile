import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CheckSquare, Clock, Home, User, Wallet } from 'lucide-react-native';
import { Text } from '@/design-system/primitives/Text';
import { DashboardScreen } from '@/features/dashboard';
import { TimelineScreen } from '@/features/timeline';
import { ChecklistScreen } from '@/features/checklist';
import { BudgetScreen } from '@/features/budget';
import { ProfileScreen } from '@/features/profile';
import { colors } from '@/design-system/tokens';
import { B2CTabParamList } from '../types';

const Tab = createBottomTabNavigator<B2CTabParamList>();
const ICON_SIZE = 18;

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      {icon}
      <Text numberOfLines={1} style={styles.tabLabel}>{label}</Text>
      {focused ? <View style={styles.dot} /> : <View style={styles.dotPlaceholder} />}
    </View>
  );
}

export function B2CTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.darkBlue,
        tabBarInactiveTintColor: colors.darkBlue,
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Home size={ICON_SIZE} color={colors.darkBlue} />}
              label="Accueil"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Clock size={ICON_SIZE} color={colors.darkBlue} />}
              label="Timeline"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<CheckSquare size={ICON_SIZE} color={colors.darkBlue} />}
              label="Tâches"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Wallet size={ICON_SIZE} color={colors.darkBlue} />}
              label="Budget"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<User size={ICON_SIZE} color={colors.darkBlue} />}
              label="Profil"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabBarIcon: {
    height: 52,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: colors.darkBlue,
    fontFamily: 'DMSans_400Regular',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkBlue,
    marginTop: 2,
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
});
