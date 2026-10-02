import React from 'react';
import { View } from 'react-native';
// TODO: Integrate @gorhom/bottom-sheet
interface BottomSheetProps { children?: React.ReactNode; }
export function BottomSheet({ children }: BottomSheetProps) { return <View>{children}</View>; }
