export class Invoice {
  id: number;
  client_id: number;
  title: string;
  description?: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  due_date: string;
  paid_at?: string;
  is_recurring: boolean;
  recurring_interval?: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}