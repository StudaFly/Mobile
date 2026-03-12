import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import type { TimelineTask } from '../types/timeline.types';

export const timelineService = {
  getTimeline: async (mobilityId: string): Promise<TimelineTask[]> => {
    const { data } = await apiClient.get<ApiResponse<TimelineTask[]>>(ENDPOINTS.MOBILITY_TIMELINE(mobilityId));
    return data.data;
  },
};
