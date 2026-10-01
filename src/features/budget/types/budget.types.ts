export type BudgetCategoryKey = 'housing' | 'food' | 'transport' | 'leisure';

export interface BudgetCategory {
  key: BudgetCategoryKey;
  label: string;
  amountMin: number;
  amountMax: number;
  currency: string;
}

export interface BudgetEstimate {
  destinationId: string;
  city: string;
  country: string;
  monthlyTotalMin: number;
  monthlyTotalMax: number;
  currency: string;
  breakdown: BudgetCategory[];
  tips: string[];
}
