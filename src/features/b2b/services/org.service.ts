import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse, PaginatedResponse } from '@/core/api/types/api.types';
import type { FollowUp, Note, OrgInfo, StudentDetail, StudentSummary, Zone } from '../types/org.types';

export const orgService = {
  async get(): Promise<OrgInfo> {
    const { data } = await apiClient.get<ApiResponse<OrgInfo>>(ENDPOINTS.ORG);
    return data.data;
  },

  async update(payload: { logoUrl?: string | null; branding?: object }): Promise<OrgInfo> {
    const { data } = await apiClient.patch<ApiResponse<OrgInfo>>(ENDPOINTS.ORG, payload);
    return data.data;
  },

  async allStudents(params: { q?: string; status?: FollowUp } = {}): Promise<StudentSummary[]> {
    const all: StudentSummary[] = [];
    for (let page = 1; ; page++) {
      const { data } = await apiClient.get<PaginatedResponse<StudentSummary>>(ENDPOINTS.ORG_STUDENTS, {
        params: { ...params, page, perPage: 100 },
      });
      all.push(...data.data);
      if (all.length >= data.total || data.data.length === 0) return all;
    }
  },

  async student(id: string): Promise<StudentDetail> {
    const { data } = await apiClient.get<ApiResponse<StudentDetail>>(ENDPOINTS.ORG_STUDENT(id));
    return data.data;
  },

  async notes(id: string): Promise<Note[]> {
    const { data } = await apiClient.get<ApiResponse<Note[]>>(ENDPOINTS.ORG_STUDENT_NOTES(id));
    return data.data;
  },

  async addNote(id: string, body: string): Promise<Note> {
    const { data } = await apiClient.post<ApiResponse<Note>>(ENDPOINTS.ORG_STUDENT_NOTES(id), { body });
    return data.data;
  },

  async zones(): Promise<Zone[]> {
    const { data } = await apiClient.get<ApiResponse<Zone[]>>(ENDPOINTS.ORG_ZONES);
    return data.data;
  },

  async joinCode(): Promise<string> {
    const { data } = await apiClient.get<ApiResponse<{ joinCode: string }>>(ENDPOINTS.ORG_JOIN_CODE);
    return data.data.joinCode;
  },
};
