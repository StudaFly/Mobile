import { useQuery } from '@tanstack/react-query';
import { orgService } from '../services/org.service';

export function useStudents() {
  return useQuery({ queryKey: ['org', 'students'], queryFn: () => orgService.allStudents() });
}
