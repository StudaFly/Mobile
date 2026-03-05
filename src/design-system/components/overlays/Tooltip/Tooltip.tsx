import React from 'react';
import { View } from 'react-native';
interface TooltipProps { content: string; children: React.ReactNode; }
export function Tooltip({ children }: TooltipProps) { return <View>{children}</View>; }
