import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../../../src/design-system/primitives/Text/Text';

describe('Text', () => {
  it('renders text content', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeDefined();
  });

  it('renders with heading1 variant', () => {
    const { getByText } = render(<Text variant="heading1">Title</Text>);
    expect(getByText('Title')).toBeDefined();
  });

  it('renders with heading2 variant', () => {
    const { getByText } = render(<Text variant="heading2">Subtitle</Text>);
    expect(getByText('Subtitle')).toBeDefined();
  });

  it('renders with body variant by default', () => {
    const { getByText } = render(<Text>Body text</Text>);
    expect(getByText('Body text')).toBeDefined();
  });

  it('renders with caption variant', () => {
    const { getByText } = render(<Text variant="caption">Small text</Text>);
    expect(getByText('Small text')).toBeDefined();
  });

  it('renders with custom color prop', () => {
    const { getByText } = render(<Text color="#FF0000">Red text</Text>);
    expect(getByText('Red text')).toBeDefined();
  });

  it('renders without color prop (uses default)', () => {
    const { getByText } = render(<Text>Default color</Text>);
    expect(getByText('Default color')).toBeDefined();
  });
});
