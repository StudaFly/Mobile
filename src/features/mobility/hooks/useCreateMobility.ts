import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { OnboardingData } from '@/features/auth/types/auth.types';
import { mobilityService } from '../services/mobility.service';
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
    departureDate: '',
    school: '',
  });

  const setActiveMobilityId = useMobilityStore((s) => s.setActiveMobilityId);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_CREATE_STEPS - 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const isLastStep = step === TOTAL_CREATE_STEPS - 1;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return data.mobilityType !== null;
      case 1: return data.destination.trim().length > 0;
      case 2: return data.departureDate.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const destinations = await mobilityService.searchDestinations(data.destination.trim());
      if (!destinations.length) {
        throw new Error(`Destination "${data.destination}" introuvable. Vérifie l'orthographe.`);
      }
      const destinationId = destinations[0].id;
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
    isLastStep,
    canProceed,
    createMobility: mutation.mutate,
    isCreating: mutation.isPending,
    creationError: mutation.error,
    totalSteps: TOTAL_CREATE_STEPS,
  };
}
