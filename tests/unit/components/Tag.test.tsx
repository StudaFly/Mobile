import React from 'react';
import { render } from '@testing-library/react-native';
import { Tag } from '../../../src/design-system/components/data-display/Tag/Tag';

describe('Tag', () => {
  it('renders admin category', () => {
    const { getByText } = render(<Tag category="admin" label="Administration" />);
    expect(getByText('Administration')).toBeDefined();
  });

  it('renders finance category', () => {
    const { getByText } = render(<Tag category="finance" label="Finance" />);
    expect(getByText('Finance')).toBeDefined();
  });

  it('renders housing category', () => {
    const { getByText } = render(<Tag category="housing" label="Logement" />);
    expect(getByText('Logement')).toBeDefined();
  });

  it('renders health category', () => {
    const { getByText } = render(<Tag category="health" label="Santé" />);
    expect(getByText('Santé')).toBeDefined();
  });

  it('renders practical category', () => {
    const { getByText } = render(<Tag category="practical" label="Pratique" />);
    expect(getByText('Pratique')).toBeDefined();
  });
});
