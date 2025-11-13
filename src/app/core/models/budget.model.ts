export interface Budget {
  id: number;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  categoryName: string;
  status: BudgetStatus;
  alertThreshold: number;
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetStatus = 'ACTIVE' | 'EXCEEDED' | 'COMPLETED' | 'CANCELLED';

export interface BudgetRequest {
  amount: number;
  startDate: string;
  endDate: string;
  categoryId: number;
  alertThreshold?: number;
}