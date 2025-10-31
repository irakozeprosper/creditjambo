export interface Repayment {
  repayment_id: number;
  loan_id: number;
  scheduled_date: Date;
  paid_amount: number;
  paid_date?: Date;
  status: 'Paid' | 'Missed';
  transaction_id?: number | null;
}
