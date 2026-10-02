import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types/task.types';
import { checklistService, CreateTaskPayload } from '../services/checklist.service';
import { CHECKLIST_QUERY_KEY } from './useChecklist';
import { PROGRESS_QUERY_KEY } from '@/features/mobility/hooks/useProgress';

const TIMELINE_QUERY_KEY = 'timeline';

export function useTaskMutation(mobilityId: string) {
  const queryClient = useQueryClient();
  const queryKeys = [
    [CHECKLIST_QUERY_KEY, mobilityId],
    [TIMELINE_QUERY_KEY, mobilityId],
  ];

  const cancelAll = () => Promise.all(queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })));
  const updateAll = (updater: (old: Task[]) => Task[]) =>
    queryKeys.forEach((queryKey) =>
      queryClient.setQueryData<Task[]>(queryKey, (old) => (old ? updater(old) : old)),
    );
  const invalidateAll = () =>
    Promise.all(
      [...queryKeys, [PROGRESS_QUERY_KEY, mobilityId]].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );

  const completeTask = useMutation({
    mutationFn: (taskId: string) => checklistService.completeTask(taskId),
    onMutate: async (taskId: string) => {
      await cancelAll();
      updateAll((old) => old.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)));
    },
    onSettled: invalidateAll,
  });

  const createTask = useMutation({
    mutationFn: (payload: CreateTaskPayload) => checklistService.createTask(mobilityId, payload),
    onMutate: async (payload: CreateTaskPayload) => {
      await cancelAll();
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
      const previous = queryKeys.map((queryKey) => queryClient.getQueryData<Task[]>(queryKey));
      updateAll((old) => [...old, optimisticTask]);
      return { previous };
    },
    onError: (_err, _payload, ctx) => {
      ctx?.previous.forEach((data, i) => {
        if (data) queryClient.setQueryData(queryKeys[i], data);
      });
    },
    onSettled: invalidateAll,
  });

  const deleteTask = useMutation({
    mutationFn: (taskId: string) => checklistService.deleteTask(taskId),
    onMutate: async (taskId: string) => {
      await cancelAll();
      updateAll((old) => old.filter((t) => t.id !== taskId));
    },
    onError: invalidateAll,
  });

  return { completeTask, createTask, deleteTask };
}
