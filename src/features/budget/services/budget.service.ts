import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import type { BudgetEstimate } from '../types/budget.types';

export const budgetService = {
  async getBudget(destinationId: string): Promise<BudgetEstimate> {
    const { data } = await apiClient.get<ApiResponse<BudgetEstimate>>(ENDPOINTS.DESTINATION_BUDGET(destinationId));
    return data.data;
  },
};
