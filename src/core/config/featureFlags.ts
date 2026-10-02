export const FEATURE_FLAGS = {
  PREMIUM_BUDGET_AI: false,
  OFFLINE_DOCUMENTS: true,
  JOURJ_MODE: true,
  B2B_BRANDING: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
