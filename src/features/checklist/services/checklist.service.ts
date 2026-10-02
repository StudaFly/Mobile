import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { Task, TaskCategory, TaskPriority } from '../types/task.types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category: TaskCategory;
  deadline?: string;
  priority: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  category?: TaskCategory;
  deadline?: string;
  priority?: TaskPriority;
  isCompleted?: boolean;
}

export const checklistService = {
  getTasks: async (mobilityId: string): Promise<Task[]> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>(ENDPOINTS.MOBILITY_TASKS(mobilityId));
    return data.data;
  },

  createTask: async (mobilityId: string, payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<ApiResponse<Task>>(ENDPOINTS.MOBILITY_TASKS(mobilityId), payload);
    return data.data;
  },

  updateTask: async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.patch<ApiResponse<Task>>(ENDPOINTS.TASK_BY_ID(taskId), payload);
    return data.data;
  },

  completeTask: async (taskId: string): Promise<Task> => {
    const { data } = await apiClient.patch<ApiResponse<Task>>(ENDPOINTS.TASK_COMPLETE(taskId));
    return data.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TASK_BY_ID(taskId));
  },
};
