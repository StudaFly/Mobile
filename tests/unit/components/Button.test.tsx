import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../src/design-system/components/actions/Button/Button';

describe('Button', () => {
  it('renders label text', () => {
    const { getByText } = render(<Button label="Click me" />);
    expect(getByText('Click me')).toBeDefined();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = render(<Button label="Primary" />);
    expect(getByText('Primary')).toBeDefined();
  });

  it('renders with secondary variant', () => {
    const { getByText } = render(<Button label="Secondary" variant="secondary" />);
    expect(getByText('Secondary')).toBeDefined();
  });

  it('renders with ghost variant', () => {
    const { getByText } = render(<Button label="Ghost" variant="ghost" />);
    expect(getByText('Ghost')).toBeDefined();
  });

  it('renders with danger variant', () => {
    const { getByText } = render(<Button label="Delete" variant="danger" />);
    expect(getByText('Delete')).toBeDefined();
  });

  it('shows ActivityIndicator when isLoading is true', () => {
    const { queryByText } = render(<Button label="Loading" isLoading />);
    expect(queryByText('Loading')).toBeNull();
  });

  it('renders with fullWidth prop', () => {
    const { getByText } = render(<Button label="Full Width" fullWidth />);
    expect(getByText('Full Width')).toBeDefined();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Press" onPress={onPress} />);
    fireEvent.press(getByText('Press'));
    expect(onPress).toHaveBeenCalled();
  });
});
