export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
  readAt?: string;
}

export type NotificationType = 'BUDGET_ALERT' | 'BUDGET_EXCEEDED' | 'GOAL_MILESTONE' | 
  'GOAL_COMPLETED' | 'RECURRING_TRANSACTION_DUE' | 'UNUSUAL_SPENDING' | 
  'SAVINGS_TIP' | 'SYSTEM_ALERT';