export interface SavingsAccount {
  account_id: number;
  user_id: number;
  account_number: string;
  current_balance: number;
  is_active: boolean;
  created_at: Date;
}
