import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { Destination, Mobility, MobilityProgress } from '../types/mobility.types';
import { MobilityTypeOption } from '@/features/auth/types/auth.types';

export interface DestinationSearchResult {
  id: string;
  country: string;
  city: string;
}

export interface CreateMobilityPayload {
  destinationId: string;
  type: MobilityTypeOption;
  departureDate: string;
  school?: string;
}

export const mobilityService = {
  async getAll(): Promise<Mobility[]> {
    const { data } = await apiClient.get<ApiResponse<Mobility[]>>(ENDPOINTS.MOBILITIES);
    return data.data;
  },

  async getById(id: string): Promise<Mobility> {
    const { data } = await apiClient.get<ApiResponse<Mobility>>(ENDPOINTS.MOBILITY_BY_ID(id));
    return data.data;
  },

  async searchDestinations(query: string): Promise<DestinationSearchResult[]> {
    const { data } = await apiClient.get<ApiResponse<DestinationSearchResult[]>>(ENDPOINTS.DESTINATIONS, {
      params: { query },
    });
    return data.data;
  },

  async getProgress(id: string): Promise<MobilityProgress> {
    const { data } = await apiClient.get<ApiResponse<MobilityProgress>>(ENDPOINTS.MOBILITY_PROGRESS(id));
    return data.data;
  },

  async getDestination(id: string): Promise<Destination> {
    const { data } = await apiClient.get<ApiResponse<Destination>>(`${ENDPOINTS.DESTINATIONS}/${id}`);
    return data.data;
  },

  async createMobility(payload: CreateMobilityPayload): Promise<Mobility> {
    const { data } = await apiClient.post<ApiResponse<Mobility>>(ENDPOINTS.MOBILITIES, payload);
    return data.data;
  },
};
