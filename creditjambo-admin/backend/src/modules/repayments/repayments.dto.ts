export interface CreateRepaymentDTO {
  loan_id: number;
  scheduled_date: Date;
  paid_amount: number;
  status?: 'Paid' | 'Missed';
  transaction_id?: number | null;
}

export interface UpdateRepaymentDTO {
  paid_amount: number;
  paid_date: Date;
  transaction_id: number;
  status?: 'Paid' | 'Missed';
}
