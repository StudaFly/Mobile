import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { OnboardingData } from '../types/auth.types';

export const TOTAL_ONBOARDING_STEPS = 4;

export function useOnboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mobilityType: null,
    destination: '',
    departureDate: '',
    school: '',
  });

  const completePendingAuth = useAuthStore((s) => s.completePendingAuth);

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_ONBOARDING_STEPS - 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const isLastStep = step === TOTAL_ONBOARDING_STEPS - 1;

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return data.mobilityType !== null;
      case 1:
        return data.destination.trim().length > 0;
      case 2:
        return data.departureDate.trim().length > 0;
      case 3:
        return true; // école optionnelle
      default:
        return false;
    }
  };

  const completeOnboarding = () => {
    completePendingAuth();
  };

  return {
    step,
    data,
    next,
    prev,
    updateData,
    isLastStep,
    canProceed,
    completeOnboarding,
    totalSteps: TOTAL_ONBOARDING_STEPS,
  };
}
