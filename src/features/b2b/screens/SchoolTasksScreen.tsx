import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ComingSoon } from '@/design-system/components/feedback/ComingSoon';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';

export function SchoolTasksScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <ComingSoon
        title="Tâches école"
        message="Les tâches propres à votre établissement arriveront dans une prochaine version."
        onBack={() => navigation.goBack()}
      />
    </ScreenWrapper>
  );
}
