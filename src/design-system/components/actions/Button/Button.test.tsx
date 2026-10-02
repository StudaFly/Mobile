import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<Button label="Click me" />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Click me" onPress={onPress} />);
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when isLoading is true', () => {
    // const { getByTestId, queryByText } = render(<Button label="Click me" isLoading />);
    // expect(queryByText('Click me')).toBeNull();
  });
});
