import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/task.types';
import { checklistService, CreateTaskPayload } from '../services/checklist.service';
import { CHECKLIST_QUERY_KEY } from './useChecklist';

export function useTaskMutation(mobilityId: string) {
  const queryClient = useQueryClient();
  const queryKey = [CHECKLIST_QUERY_KEY, mobilityId];

  const completeTask = useMutation({
    mutationFn: (taskId: string) => checklistService.completeTask(taskId),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t,
        ),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const createTask = useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      checklistService.createTask(mobilityId, payload),
    onMutate: async (payload: CreateTaskPayload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        mobilityId,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        deadline: payload.deadline,
        priority: payload.priority,
        isCompleted: false,
      };
      queryClient.setQueryData<Task[]>(queryKey, (old = []) => [
        ...old,
        optimisticTask,
      ]);
      return { previous };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (taskId: string) => checklistService.deleteTask(taskId),
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.filter((t) => t.id !== taskId),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { completeTask, createTask, deleteTask };
}
