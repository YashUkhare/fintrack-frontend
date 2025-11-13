export interface Category {
  id: number;
  name: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
}