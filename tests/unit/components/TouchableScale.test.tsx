import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableScale } from '../../../src/design-system/primitives/TouchableScale/TouchableScale';

describe('TouchableScale', () => {
  it('renders children', () => {
    const { getByText } = render(
      <TouchableScale>
        <Text>Content</Text>
      </TouchableScale>
    );
    expect(getByText('Content')).toBeDefined();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TouchableScale onPress={onPress}>
        <Text>Press me</Text>
      </TouchableScale>
    );
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('calls custom onPressIn handler', () => {
    const onPressIn = jest.fn();
    const { getByText } = render(
      <TouchableScale onPressIn={onPressIn}>
        <Text>Pressable</Text>
      </TouchableScale>
    );
    fireEvent(getByText('Pressable'), 'pressIn');
    expect(onPressIn).toHaveBeenCalled();
  });

  it('calls custom onPressOut handler', () => {
    const onPressOut = jest.fn();
    const { getByText } = render(
      <TouchableScale onPressOut={onPressOut}>
        <Text>Pressable</Text>
      </TouchableScale>
    );
    fireEvent(getByText('Pressable'), 'pressOut');
    expect(onPressOut).toHaveBeenCalled();
  });

  it('accepts custom scaleValue prop', () => {
    const { getByText } = render(
      <TouchableScale scaleValue={0.9}>
        <Text>Scaled</Text>
      </TouchableScale>
    );
    expect(getByText('Scaled')).toBeDefined();
  });
});
