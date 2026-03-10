import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { TimelineTask } from '../types/timeline.types';

export const timelineService = {
  getTimeline: async (mobilityId: string): Promise<TimelineTask[]> => {
    const { data } = await apiClient.get<TimelineTask[]>(ENDPOINTS.MOBILITY_TIMELINE(mobilityId));
    return data;
  },
};
