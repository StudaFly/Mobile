import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { ComingSoon } from '@/design-system/components/feedback/ComingSoon';

export function DocumentsScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <ComingSoon
        title="Mes documents"
        message="Tu pourras bientôt stocker ici ton passeport, ton visa et tes attestations, accessibles même hors-ligne."
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
      />
    </ScreenWrapper>
  );
}
