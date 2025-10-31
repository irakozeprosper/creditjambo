export interface Transaction {
  transaction_id: number;
  account_id: number;
  type: 'Deposit' | 'Withdrawal' | 'Loan Disbursement' | 'Repayment';
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Reversed';
  reference_number: string;
  transaction_date: Date;
  source_destination_name: string;
  source_destination_account: number;
}