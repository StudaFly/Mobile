import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import type { AuthResponse } from '@/features/auth/services/auth.service';
import type { OrgRole, OrganizationSummary } from '@/features/auth/types/auth.types';

export interface ConsentScope {
  sharedWithSchool: string[];
  neverShared: string[];
}

export interface InvitationPreview extends ConsentScope {
  organization: OrganizationSummary;
  kind: 'student' | 'staff';
  orgRole: OrgRole | null;
  email: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expiresAt: string;
}

export interface InvitationAcceptResult {
  kind: 'student' | 'staff';
  organization: OrganizationSummary;
  auth: AuthResponse | null;
}

export const organizationService = {
  async previewByCode(code: string): Promise<ConsentScope & { organization: OrganizationSummary }> {
    const { data } = await apiClient.get<ApiResponse<ConsentScope & { organization: OrganizationSummary }>>(
      ENDPOINTS.ORGANIZATION_BY_CODE(code),
    );
    return data.data;
  },

  async join(code: string): Promise<OrganizationSummary> {
    const { data } = await apiClient.post<ApiResponse<OrganizationSummary>>(ENDPOINTS.ORGANIZATION_JOIN, { code });
    return data.data;
  },

  async leave(): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS_ME_ORGANIZATION);
  },

  async previewInvitation(token: string): Promise<InvitationPreview> {
    const { data } = await apiClient.get<ApiResponse<InvitationPreview>>(ENDPOINTS.INVITATION(token));
    return data.data;
  },

  async acceptInvitation(token: string, body?: { name: string; password: string }): Promise<InvitationAcceptResult> {
    const { data } = await apiClient.post<ApiResponse<InvitationAcceptResult>>(ENDPOINTS.INVITATION_ACCEPT(token), body);
    return data.data;
  },
};
