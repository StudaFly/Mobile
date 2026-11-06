import { useQuery } from '@tanstack/react-query';
import { orgService } from '../services/org.service';
import { useStudents } from './useStudents';

export function useOrg() {
  return useQuery({ queryKey: ['org'], queryFn: orgService.get });
}

export function useB2BDashboard() {
  const org = useOrg();
  const students = useStudents();
  const joinCode = useQuery({ queryKey: ['org', 'join-code'], queryFn: orgService.joinCode });
  const list = students.data ?? [];
  return {
    org: org.data,
    joinCode: joinCode.data,
    isLoading: org.isLoading || students.isLoading,
    refetch: () => Promise.all([org.refetch(), students.refetch()]),
    total: list.length,
    danger: list.filter((s) => s.followUp === 'danger'),
    warning: list.filter((s) => s.followUp === 'warning'),
    unassigned: list.filter((s) => s.mobility && !s.mobility.advisor),
  };
}
