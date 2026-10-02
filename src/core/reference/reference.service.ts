import apiClient from '@/core/api/client';
import { ApiResponse } from '@/core/api/types/api.types';

export interface ReferenceData {
  mobilityTypes: { key: string; label: string; description: string }[];
  taskCategories: { key: string; label: string }[];
  taskPriorities: { value: number; label: string }[];
  avatarEmojis: string[];
}

export const referenceService = {
  async getReference(): Promise<ReferenceData> {
    const { data } = await apiClient.get<ApiResponse<ReferenceData>>('/reference');
    return data.data;
  },
};
