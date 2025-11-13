export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  categoryId: number;
  categoryName: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  tags: string[];
  attachmentUrl?: string;
  currency: string;
  exchangeRate?: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 
  'BANK_TRANSFER' | 'UPI' | 'WALLET' | 'CHEQUE' | 'OTHER';

export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface TransactionRequest {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  categoryId: number;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  tags?: string[];
  attachmentUrl?: string;
  currency?: string;
  exchangeRate?: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
  startDate: string;
  endDate: string;
}