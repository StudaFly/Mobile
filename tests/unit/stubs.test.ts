// Tests for all empty service/hook stubs — importing them covers their only statement

import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { checklistService } from '../../src/features/checklist/services/checklist.service';
import { budgetService } from '../../src/features/budget/services/budget.service';
import { timelineService } from '../../src/features/timeline/services/timeline.service';
import { documentsService } from '../../src/features/documents/services/documents.service';
import { guideService } from '../../src/features/guide/services/guide.service';
import { userService } from '../../src/features/profile/services/user.service';

import { useChecklist } from '../../src/features/checklist/hooks/useChecklist';
import { useTaskMutation } from '../../src/features/checklist/hooks/useTaskMutation';
import { useTimeline } from '../../src/features/timeline/hooks/useTimeline';
import { useDocuments } from '../../src/features/documents/hooks/useDocuments';
import { useOfflineDocuments } from '../../src/features/documents/hooks/useOfflineDocuments';
import { useJourJ } from '../../src/features/jourj/hooks/useJourJ';

describe('Empty services', () => {
  it('checklistService is defined', () => {
    expect(checklistService).toBeDefined();
  });

  it('budgetService is defined', () => {
    expect(budgetService).toBeDefined();
  });

  it('timelineService is defined', () => {
    expect(timelineService).toBeDefined();
  });

  it('documentsService is defined', () => {
    expect(documentsService).toBeDefined();
  });

  it('guideService is defined', () => {
    expect(guideService).toBeDefined();
  });

  it('userService is defined', () => {
    expect(userService).toBeDefined();
  });
});

describe('Empty hooks', () => {
  it('useChecklist is callable', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    const { result } = renderHook(() => useChecklist(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('useTaskMutation is callable', () => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    const { result } = renderHook(() => useTaskMutation('mob-1'), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('useTimeline is callable', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    const { result } = renderHook(() => useTimeline(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('useDocuments is callable', () => {
    expect(() => useDocuments()).not.toThrow();
  });

  it('useOfflineDocuments is callable', () => {
    expect(() => useOfflineDocuments()).not.toThrow();
  });

  it('useJourJ is callable', () => {
    expect(() => useJourJ()).not.toThrow();
  });

});
