export interface CreateSavingsAccountDTO {
  user_id: number;
  account_number: string;
  current_balance?: number;
}

export interface UpdateSavingsAccountDTO {
  current_balance?: number;
  is_active?: boolean;
}
