import { useState } from 'react';
export function useOnboarding() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));
  return { step, next, prev };
}
