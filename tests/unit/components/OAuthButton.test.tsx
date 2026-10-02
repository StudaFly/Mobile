import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OAuthButton } from '../../../src/features/auth/components/OAuthButton';

describe('OAuthButton', () => {
  it('renders Google label', () => {
    const { getByText } = render(<OAuthButton provider="google" onPress={jest.fn()} />);
    expect(getByText('Continuer avec Google')).toBeDefined();
  });

  it('renders Apple label', () => {
    const { getByText } = render(<OAuthButton provider="apple" onPress={jest.fn()} />);
    expect(getByText('Continuer avec Apple')).toBeDefined();
  });

  it('renders Microsoft label', () => {
    const { getByText } = render(<OAuthButton provider="microsoft" onPress={jest.fn()} />);
    expect(getByText('Continuer avec Microsoft')).toBeDefined();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<OAuthButton provider="google" onPress={onPress} />);
    fireEvent.press(getByText('Continuer avec Google'));
    expect(onPress).toHaveBeenCalled();
  });

  it('hides label when isLoading is true', () => {
    const { queryByText } = render(<OAuthButton provider="google" onPress={jest.fn()} isLoading />);
    expect(queryByText('Continuer avec Google')).toBeNull();
  });
});
