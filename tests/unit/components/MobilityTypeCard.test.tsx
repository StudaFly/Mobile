import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MobilityTypeCard } from '../../../src/features/auth/components/MobilityTypeCard';

describe('MobilityTypeCard', () => {
  const defaultProps = {
    value: 'erasmus' as const,
    label: 'Erasmus',
    iconName: 'Globe' as const,
    selected: false,
    onSelect: jest.fn(),
  };

  it('renders label', () => {
    const { getByText } = render(<MobilityTypeCard {...defaultProps} />);
    expect(getByText('Erasmus')).toBeDefined();
  });

  it('renders icon without crashing', () => {
    const { UNSAFE_root } = render(<MobilityTypeCard {...defaultProps} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('calls onSelect with value when pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<MobilityTypeCard {...defaultProps} onSelect={onSelect} />);
    fireEvent.press(getByText('Erasmus'));
    expect(onSelect).toHaveBeenCalledWith('erasmus');
  });

  it('renders without crashing when selected', () => {
    const { getByText } = render(<MobilityTypeCard {...defaultProps} selected />);
    expect(getByText('Erasmus')).toBeDefined();
  });
});
