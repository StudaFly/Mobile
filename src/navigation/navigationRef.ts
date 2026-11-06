import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/** Lets code outside screens (push notification taps, deep links) navigate. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
