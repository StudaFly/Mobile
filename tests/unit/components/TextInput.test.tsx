import React from 'react';
import { render } from '@testing-library/react-native';
import { TextInput } from '../../../src/design-system/components/forms/TextInput/TextInput';

describe('TextInput', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<TextInput />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('renders label when provided', () => {
    const { getByText } = render(<TextInput label="Email" />);
    expect(getByText('Email')).toBeDefined();
  });

  it('does not render label when not provided', () => {
    const { queryByText } = render(<TextInput placeholder="Enter text" />);
    expect(queryByText('Email')).toBeNull();
  });

  it('renders error message when error prop is set', () => {
    const { getByText } = render(<TextInput error="Invalid email" />);
    expect(getByText('Invalid email')).toBeDefined();
  });

  it('renders hint text when no error', () => {
    const { getByText } = render(<TextInput hint="Enter your email address" />);
    expect(getByText('Enter your email address')).toBeDefined();
  });

  it('does not render hint when error is present', () => {
    const { queryByText } = render(<TextInput error="Error!" hint="Hint text" />);
    expect(queryByText('Hint text')).toBeNull();
  });

  it('renders both label and error', () => {
    const { getByText } = render(<TextInput label="Email" error="Required" />);
    expect(getByText('Email')).toBeDefined();
    expect(getByText('Required')).toBeDefined();
  });
});
