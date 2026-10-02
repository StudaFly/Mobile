import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { OnboardingData } from '@/features/auth/types/auth.types';
import { mobilityService, type DestinationSearchResult } from '../services/mobility.service';
import { formatDestination } from '../utils';
import { useMobilityStore } from '../store/mobility.store';

export const TOTAL_CREATE_STEPS = 4;

function toISO(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('/');
  return `${y}-${m}-${d}`;
}

export function useCreateMobility(onSuccess: () => void) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mobilityType: null,
    destination: '',
    destinationId: null,
    departureDate: '',
    school: '',
  });

  const setActiveMobilityId = useMobilityStore((s) => s.setActiveMobilityId);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_CREATE_STEPS - 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({
      ...d,
      [key]: value,
      ...(key === 'destination' ? { destinationId: null } : {}),
    }));

  const selectDestination = (destination: DestinationSearchResult) =>
    setData((d) => ({ ...d, destination: formatDestination(destination), destinationId: destination.id }));

  const isLastStep = step === TOTAL_CREATE_STEPS - 1;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return data.mobilityType !== null;
      case 1: return data.destinationId !== null;
      case 2: return data.departureDate.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { destinationId } = data;
      if (!destinationId) {
        throw new Error('Choisis ta destination dans la liste.');
      }
      const mobility = await mobilityService.createMobility({
        destinationId,
        type: data.mobilityType!,
        departureDate: toISO(data.departureDate),
        school: data.school.trim() || undefined,
      });
      return mobility;
    },
    onSuccess: (mobility) => {
      setActiveMobilityId(mobility.id);
      onSuccess();
    },
  });

  return {
    step,
    data,
    next,
    prev,
    updateData,
    selectDestination,
    isLastStep,
    canProceed,
    createMobility: mutation.mutate,
    isCreating: mutation.isPending,
    creationError: mutation.error,
    totalSteps: TOTAL_CREATE_STEPS,
  };
}
