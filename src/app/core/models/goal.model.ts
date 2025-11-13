export interface Goal {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  targetDate: string;
  status: GoalStatus;
  icon: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';

export interface GoalRequest {
  name: string;
  description: string;
  targetAmount: number;
  targetDate: string;
  icon?: string;
}