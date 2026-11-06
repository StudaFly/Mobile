import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import { env } from '@/core/config/env';
import type { RootStackParamList } from './types';

/** studafly://invitations/<token> and the web link sent by email (falls back to the web page). */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), env.WEB_URL],
  config: {
    screens: {
      Invitation: 'invitations/:token',
    },
  },
};
