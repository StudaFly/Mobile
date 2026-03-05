jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

import apiClient from '../../../src/core/api/client';
import { mobilityService } from '../../../src/features/mobility/services/mobility.service';
import { ENDPOINTS } from '../../../src/core/api/endpoints';

const mockGet = apiClient.get as jest.Mock;

const mockMobility = {
  id: 'mob-1',
  userId: 'user-1',
  destinationId: 'dest-1',
  type: 'erasmus' as const,
  departureDate: '2025-09-01',
  status: 'preparing' as const,
};

describe('mobilityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls GET to MOBILITIES endpoint', async () => {
      mockGet.mockResolvedValue({ data: { data: [mockMobility] } });
      const result = await mobilityService.getAll();
      expect(mockGet).toHaveBeenCalledWith(ENDPOINTS.MOBILITIES);
      expect(result).toEqual([mockMobility]);
    });
  });

  describe('getById', () => {
    it('calls GET to MOBILITY_BY_ID endpoint', async () => {
      mockGet.mockResolvedValue({ data: { data: mockMobility } });
      const result = await mobilityService.getById('mob-1');
      expect(mockGet).toHaveBeenCalledWith(ENDPOINTS.MOBILITY_BY_ID('mob-1'));
      expect(result).toEqual(mockMobility);
    });

    it('passes the correct id in the URL', async () => {
      mockGet.mockResolvedValue({ data: { data: mockMobility } });
      await mobilityService.getById('specific-id-99');
      expect(mockGet).toHaveBeenCalledWith('/mobilities/specific-id-99');
    });
  });
});
