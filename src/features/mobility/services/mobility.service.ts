import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { Mobility } from '../types/mobility.types';

export const mobilityService = {
  async getAll(): Promise<Mobility[]> {
    const { data } = await apiClient.get<ApiResponse<Mobility[]>>(ENDPOINTS.MOBILITIES);
    return data.data;
  },
  async getById(id: string): Promise<Mobility> {
    const { data } = await apiClient.get<ApiResponse<Mobility>>(ENDPOINTS.MOBILITY_BY_ID(id));
    return data.data;
  },
};
