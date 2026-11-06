import { navigationRef } from '@/navigation/navigationRef';
import type { AccountType } from '@/features/auth/types/auth.types';
import { isTaskReminder } from './utils/format';

/** Opens the screen a notification is about: the checklist for reminders, the list otherwise. */
export function openNotificationTarget(type: string | undefined, accountType: AccountType | undefined): void {
  if (!navigationRef.isReady()) return;
  if (accountType === 'org_staff') {
    navigationRef.navigate('B2B', { screen: 'Notifications' });
  } else if (type && isTaskReminder(type)) {
    navigationRef.navigate('B2C', { screen: 'Tabs', params: { screen: 'Checklist' } });
  } else {
    navigationRef.navigate('B2C', { screen: 'Notifications' });
  }
}
