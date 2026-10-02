import { useQuery } from '@tanstack/react-query';
import { referenceService, type ReferenceData } from './reference.service';

const EMPTY: ReferenceData = { mobilityTypes: [], taskCategories: [], taskPriorities: [], avatarEmojis: [] };

export function useReference() {
  const query = useQuery({
    queryKey: ['reference'],
    queryFn: referenceService.getReference,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const data = query.data ?? EMPTY;

  return {
    ...data,
    isLoading: query.isLoading,
    categoryLabel: (key: string) => data.taskCategories.find((c) => c.key === key)?.label ?? key,
    mobilityTypeLabel: (key: string) => data.mobilityTypes.find((t) => t.key === key)?.label ?? key,
    priorityLabel: (value: number) => data.taskPriorities.find((p) => p.value === value)?.label ?? '',
  };
}
