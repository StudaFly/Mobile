import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { OnboardingStep } from '../../../src/features/auth/components/OnboardingStep';

describe('OnboardingStep', () => {
  it('renders title', () => {
    const { getByText } = render(
      <OnboardingStep title="Ton type de mobilité">
        <Text>Child</Text>
      </OnboardingStep>,
    );
    expect(getByText('Ton type de mobilité')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <OnboardingStep title="Titre" subtitle="Sous-titre">
        <Text>Child</Text>
      </OnboardingStep>,
    );
    expect(getByText('Sous-titre')).toBeDefined();
  });

  it('does not render subtitle when omitted', () => {
    const { queryByText } = render(
      <OnboardingStep title="Titre">
        <Text>Child</Text>
      </OnboardingStep>,
    );
    expect(queryByText('Sous-titre')).toBeNull();
  });

  it('renders children', () => {
    const { getByText } = render(
      <OnboardingStep title="Titre">
        <Text>Mon contenu enfant</Text>
      </OnboardingStep>,
    );
    expect(getByText('Mon contenu enfant')).toBeDefined();
  });
});
