export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_OAUTH_GOOGLE: '/auth/oauth/google',
  AUTH_OAUTH_MICROSOFT: '/auth/oauth/microsoft',
  AUTH_OAUTH_APPLE: '/auth/oauth/apple',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // Users
  USERS_ME: '/users/me',
  USERS_ME_EXPORT: '/users/me/export',
  USERS_ME_ORGANIZATION: '/users/me/organization',

  // Schools (student side)
  ORGANIZATION_BY_CODE: (code: string) => `/organizations/by-code/${encodeURIComponent(code)}`,
  ORGANIZATION_JOIN: '/organizations/join',
  INVITATION: (token: string) => `/invitations/${encodeURIComponent(token)}`,
  INVITATION_ACCEPT: (token: string) => `/invitations/${encodeURIComponent(token)}/accept`,

  // Organization space (international relations staff)
  ORG: '/org',
  ORG_MEMBERS: '/org/members',
  ORG_STUDENTS: '/org/students',
  ORG_STUDENT: (id: string) => `/org/students/${id}`,
  ORG_STUDENT_NOTES: (id: string) => `/org/students/${id}/notes`,
  ORG_ZONES: '/org/zones',
  ORG_JOIN_CODE: '/org/join-code',

  // Mobilities
  MOBILITIES: '/mobilities',
  MOBILITY_BY_ID: (id: string) => `/mobilities/${id}`,
  MOBILITY_TIMELINE: (id: string) => `/mobilities/${id}/timeline`,
  MOBILITY_PROGRESS: (id: string) => `/mobilities/${id}/progress`,

  // Tasks
  MOBILITY_TASKS: (id: string) => `/mobilities/${id}/tasks`,
  TASK_BY_ID: (taskId: string) => `/tasks/${taskId}`,
  TASK_COMPLETE: (taskId: string) => `/tasks/${taskId}/complete`,

  // Documents
  MOBILITY_DOCUMENTS: (id: string) => `/mobilities/${id}/documents`,
  DOCUMENT_BY_ID: (docId: string) => `/documents/${docId}`,

  // Destinations
  DESTINATIONS: '/destinations',
  DESTINATION_BUDGET: (id: string) => `/destinations/${id}/budget`,
  DESTINATION_GUIDE: (id: string) => `/destinations/${id}/guide`,
} as const;
