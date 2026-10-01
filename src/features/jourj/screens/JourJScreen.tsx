import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { ComingSoon } from '@/design-system/components/feedback/ComingSoon';

export function JourJScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <ComingSoon
        title="Mode Jour J"
        message="Le jour du départ, ce mode t'accompagnera : checklist de dernière minute, arrivée et premières 48 h."
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
      />
    </ScreenWrapper>
  );
}
