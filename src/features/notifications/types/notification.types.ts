export type NotificationType =
  | 'task_due_soon'
  | 'task_due_today'
  | 'task_overdue'
  | 'organization_invitation'
  | 'invitation_accepted';

export interface AppNotification {
  id: string;
  /** Kept open so a type added on the backend does not break the screen. */
  type: NotificationType | (string & {});
  title: string;
  body: string | null;
  data: Record<string, string>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationList {
  items: AppNotification[];
  unreadCount: number;
}

export type PushPlatform = 'ios' | 'android';
