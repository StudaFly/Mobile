import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../../src/design-system/components/data-display/Badge/Badge';

describe('Badge', () => {
  it('renders with neutral variant by default', () => {
    const { getByText } = render(<Badge label="Status" />);
    expect(getByText('Status')).toBeDefined();
  });

  it('renders with success variant', () => {
    const { getByText } = render(<Badge variant="success" label="Completed" />);
    expect(getByText('Completed')).toBeDefined();
  });

  it('renders with warning variant', () => {
    const { getByText } = render(<Badge variant="warning" label="Pending" />);
    expect(getByText('Pending')).toBeDefined();
  });

  it('renders with danger variant', () => {
    const { getByText } = render(<Badge variant="danger" label="Error" />);
    expect(getByText('Error')).toBeDefined();
  });

  it('renders with info variant', () => {
    const { getByText } = render(<Badge variant="info" label="Info" />);
    expect(getByText('Info')).toBeDefined();
  });

  it('renders the label text', () => {
    const { getByText } = render(<Badge label="My Badge" />);
    expect(getByText('My Badge')).toBeDefined();
  });
});
