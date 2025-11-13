export interface DashboardAnalytics {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
  monthlyComparison: MonthlyComparison;
  categoryWiseExpense: { [key: string]: number };
  topExpenseCategories: CategoryExpenseData[];
  monthlyTrend: MonthlyTrendData[];
  spendingByPaymentMethod: { [key: string]: number };
  aiInsights: AIInsight[];
}

export interface MonthlyComparison {
  currentMonthExpense: number;
  previousMonthExpense: number;
  change: number;
  changePercentage: number;
}

export interface CategoryExpenseData {
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlyTrendData {
  month: string;
  year: number;
  income: number;
  expense: number;
  savings: number;
}

export interface AIInsight {
  type: string;
  title: string;
  message: string;
  priority: number;
  actionable: boolean;
  recommendation: string;
}