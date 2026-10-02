import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mobilityService } from '../services/mobility.service';

const DEBOUNCE_MS = 250;

export function useDestinationSearch(query: string) {
  const [debounced, setDebounced] = useState(query.trim());

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['destinations', debounced],
    queryFn: () => mobilityService.searchDestinations(debounced),
    staleTime: 1000 * 60 * 10,
  });
}
