import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskMutation } from '../../../src/features/checklist/hooks/useTaskMutation';
import { CHECKLIST_QUERY_KEY } from '../../../src/features/checklist/hooks/useChecklist';
import { Task } from '../../../src/features/checklist/types/task.types';

jest.mock('@/core/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../src/features/checklist/services/checklist.service', () => ({
  checklistService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    completeTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

import { checklistService } from '../../../src/features/checklist/services/checklist.service';

const mockedChecklistService = checklistService as jest.Mocked<typeof checklistService>;

const MOBILITY_ID = 'test-mobility-1';
const QUERY_KEY = [CHECKLIST_QUERY_KEY, MOBILITY_ID];

const mockTasks: Task[] = [
  { id: 'task-1', mobilityId: MOBILITY_ID, title: 'Task One', category: 'admin', isCompleted: false, priority: 1 },
  { id: 'task-2', mobilityId: MOBILITY_ID, title: 'Task Two', category: 'finance', isCompleted: true, priority: 2 },
];

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useTaskMutation — branch coverage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    // Pre-seed the cache with some tasks
    queryClient.setQueryData<Task[]>(QUERY_KEY, [...mockTasks]);
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('completeTask — onMutate optimistic update', () => {
    it('toggles isCompleted for the target task optimistically', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      // completeTask swallows backend errors, so no need for service to succeed
      mockedChecklistService.completeTask.mockRejectedValue(new Error('No backend'));

      await act(async () => {
        result.current.completeTask.mutate('task-1');
      });

      // Wait for onMutate to run
      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        const target = cached?.find((t) => t.id === 'task-1');
        expect(target?.isCompleted).toBe(true); // was false, should be toggled to true
      });
    });

    it('toggles isCompleted back when task was already completed', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      mockedChecklistService.completeTask.mockRejectedValue(new Error('No backend'));

      await act(async () => {
        result.current.completeTask.mutate('task-2'); // task-2 starts as isCompleted: true
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        const target = cached?.find((t) => t.id === 'task-2');
        expect(target?.isCompleted).toBe(false); // toggled from true to false
      });
    });

    it('leaves tasks with non-matching ids unchanged', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      mockedChecklistService.completeTask.mockRejectedValue(new Error('No backend'));

      await act(async () => {
        result.current.completeTask.mutate('task-1');
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        const other = cached?.find((t) => t.id === 'task-2');
        // task-2 should remain unchanged
        expect(other?.isCompleted).toBe(true);
      });
    });
  });

  describe('deleteTask — onMutate optimistic update', () => {
    it('removes the target task from cache optimistically', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      mockedChecklistService.deleteTask.mockRejectedValue(new Error('No backend'));

      await act(async () => {
        result.current.deleteTask.mutate('task-1');
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        expect(cached?.find((t) => t.id === 'task-1')).toBeUndefined();
        // Other tasks remain
        expect(cached?.find((t) => t.id === 'task-2')).toBeDefined();
      });
    });

    it('keeps remaining tasks when one is deleted', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      mockedChecklistService.deleteTask.mockRejectedValue(new Error('No backend'));

      await act(async () => {
        result.current.deleteTask.mutate('task-2');
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        expect(cached).toHaveLength(1);
        expect(cached?.[0].id).toBe('task-1');
      });
    });
  });

  describe('createTask — onMutate optimistic insert', () => {
    it('adds an optimistic task to the cache', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      const createdTask: Task = {
        id: 'server-task-3',
        mobilityId: MOBILITY_ID,
        title: 'New Task',
        category: 'housing',
        isCompleted: false,
        priority: 1,
      };
      mockedChecklistService.createTask.mockResolvedValue(createdTask);

      await act(async () => {
        result.current.createTask.mutate({
          title: 'New Task',
          category: 'housing',
          priority: 1,
        });
      });

      // After onMutate, an optimistic task should appear with id starting "temp-"
      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        const optimistic = cached?.find((t) => t.id.startsWith('temp-'));
        expect(optimistic).toBeDefined();
        expect(optimistic?.title).toBe('New Task');
        expect(optimistic?.isCompleted).toBe(false);
      });
    });

    it('sets all payload fields on the optimistic task', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      const createdTask: Task = {
        id: 'server-task-4',
        mobilityId: MOBILITY_ID,
        title: 'Visa Application',
        description: 'Submit at consulate',
        category: 'admin',
        deadline: '2025-08-01',
        isCompleted: false,
        priority: 3,
      };
      mockedChecklistService.createTask.mockResolvedValue(createdTask);

      await act(async () => {
        result.current.createTask.mutate({
          title: 'Visa Application',
          description: 'Submit at consulate',
          category: 'admin',
          deadline: '2025-08-01',
          priority: 3,
        });
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        const optimistic = cached?.find((t) => t.id.startsWith('temp-'));
        expect(optimistic?.description).toBe('Submit at consulate');
        expect(optimistic?.category).toBe('admin');
        expect(optimistic?.deadline).toBe('2025-08-01');
        expect(optimistic?.priority).toBe(3);
        expect(optimistic?.mobilityId).toBe(MOBILITY_ID);
      });
    });
  });

  describe('createTask — onError rollback (ctx.previous branch)', () => {
    it('restores previous data when mutation fails and previous data exists', async () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      // Seed cache with original data
      const original: Task[] = [
        { id: 'task-1', mobilityId: MOBILITY_ID, title: 'Original Task', category: 'admin', isCompleted: false, priority: 1 },
      ];
      queryClient.setQueryData<Task[]>(QUERY_KEY, original);

      // createTask will reject, triggering onError
      mockedChecklistService.createTask.mockRejectedValue(new Error('Server error'));

      await act(async () => {
        result.current.createTask.mutate({
          title: 'Failed Task',
          category: 'health',
          priority: 2,
        });
      });

      // After error, cache should be rolled back to original
      await waitFor(() => {
        const cached = queryClient.getQueryData<Task[]>(QUERY_KEY);
        expect(cached).toEqual(original);
      });
    });

    it('handles onError when ctx.previous is undefined (no prior cache)', async () => {
      // Start with empty/no cache to exercise the ctx?.previous falsy branch
      queryClient.removeQueries({ queryKey: QUERY_KEY });

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useTaskMutation(MOBILITY_ID), { wrapper });

      mockedChecklistService.createTask.mockRejectedValue(new Error('Server error'));

      // Should not throw — the if (ctx?.previous) guard protects against undefined
      await expect(
        act(() => {
          result.current.createTask.mutate({
            title: 'Failed Task',
            category: 'health',
            priority: 2,
          });
        }),
      ).resolves.not.toThrow();

      await waitFor(() => {
        expect(result.current.createTask.isIdle || result.current.createTask.isError).toBe(true);
      });
    });
  });
});
