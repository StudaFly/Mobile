import { TextProps as RNTextProps } from 'react-native';
import { TypographyVariant } from '@/design-system/tokens';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
}
