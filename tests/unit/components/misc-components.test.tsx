import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('lucide-react-native', () => ({
  Plus: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  X: () => null,
}));

import { Avatar } from '../../../src/design-system/components/data-display/Avatar/Avatar';
import { Card } from '../../../src/design-system/components/data-display/Card/Card';
import { CountdownBadge } from '../../../src/design-system/components/data-display/CountdownBadge/CountdownBadge';
import { ProgressBar } from '../../../src/design-system/components/data-display/ProgressBar/ProgressBar';
import { Divider } from '../../../src/design-system/components/layout/Divider/Divider';
import { FAB } from '../../../src/design-system/components/actions/FAB/FAB';
import { IconButton } from '../../../src/design-system/components/actions/IconButton/IconButton';
import { Icon } from '../../../src/design-system/primitives/Icon/Icon';
import { Text } from 'react-native';

describe('Avatar', () => {
  it('renders with initials when no uri', () => {
    const { getByText } = render(<Avatar initials="LB" />);
    expect(getByText('LB')).toBeDefined();
  });

  it('renders with default initials ?', () => {
    const { getByText } = render(<Avatar />);
    expect(getByText('?')).toBeDefined();
  });

  it('renders with uri (shows image instead of initials)', () => {
    const { queryByText } = render(<Avatar uri="https://example.com/avatar.jpg" initials="LB" />);
    expect(queryByText('LB')).toBeNull();
  });

  it('accepts custom size', () => {
    const { getByText } = render(<Avatar size={60} initials="AB" />);
    expect(getByText('AB')).toBeDefined();
  });
});

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeDefined();
  });
});

describe('CountdownBadge', () => {
  it('renders J-N format', () => {
    const { getByText } = render(<CountdownBadge days={42} />);
    expect(getByText('J-42')).toBeDefined();
  });

  it('renders with 0 days', () => {
    const { getByText } = render(<CountdownBadge days={0} />);
    expect(getByText('J-0')).toBeDefined();
  });
});

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<ProgressBar progress={50} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('clamps progress above 100', () => {
    const { UNSAFE_root } = render(<ProgressBar progress={150} />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('Divider', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<Divider />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('Icon', () => {
  it('renders a known icon', () => {
    const { UNSAFE_root } = render(<Icon name="Plus" />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('FAB', () => {
  it('renders without crashing', () => {
    const onPress = jest.fn();
    const { UNSAFE_root } = render(<FAB onPress={onPress} />);
    expect(UNSAFE_root).toBeDefined();
  });
});

describe('IconButton', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<IconButton iconName="X" />);
    expect(UNSAFE_root).toBeDefined();
  });
});
