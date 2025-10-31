export interface CreateTransactionDTO {
  account_id: number;
  type: 'Deposit' | 'Withdrawal' | 'Loan Disbursement' | 'Repayment';
  amount: number;
  status?: 'Pending' | 'Completed' | 'Failed' | 'Reversed';
  reference_number: string;
  source_destination_name: string;
  source_destination_account: number;
}

export interface UpdateTransactionStatusDTO {
  status: 'Pending' | 'Completed' | 'Failed' | 'Reversed';
}
