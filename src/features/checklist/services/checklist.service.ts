import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
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
    const { data } = await apiClient.get<Task[]>(ENDPOINTS.MOBILITY_TASKS(mobilityId));
    return data;
  },

  createTask: async (mobilityId: string, payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>(ENDPOINTS.MOBILITY_TASKS(mobilityId), payload);
    return data;
  },

  updateTask: async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.patch<Task>(ENDPOINTS.TASK_BY_ID(taskId), payload);
    return data;
  },

  completeTask: async (taskId: string): Promise<Task> => {
    const { data } = await apiClient.patch<Task>(ENDPOINTS.TASK_COMPLETE(taskId));
    return data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.TASK_BY_ID(taskId));
  },
};
