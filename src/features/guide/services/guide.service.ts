import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import type { DestinationGuide } from '../types/guide.types';

export const guideService = {
  async getGuide(destinationId: string): Promise<DestinationGuide> {
    const { data } = await apiClient.get<ApiResponse<DestinationGuide>>(ENDPOINTS.DESTINATION_GUIDE(destinationId));
    return data.data;
  },
};
