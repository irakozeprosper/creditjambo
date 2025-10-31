export interface Loan {
  loan_id: number;
  account_id: number;
  request_id: number;
  disbursed_amount: number;
  total_repayable: number;
  left_to_repay: number;
  disbursement_date: Date;
  due_date: Date;
  status: 'Active' | 'Paid' | 'Defaulted';
  approver_id?: number;
}
