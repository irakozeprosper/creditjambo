export interface CreateLoanDTO {
  request_id: number;
  account_id: number;
  disbursed_amount: number;
  total_repayable: number;
  left_to_repay: number;
  due_date: Date;
  approver_id?: number;
}

export interface UpdateLoanStatusDTO {
  status: 'Active' | 'Paid' | 'Defaulted';
}
