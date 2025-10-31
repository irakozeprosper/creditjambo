export interface LoanRequest {
  request_id: number;
  account_id: number;
  requested_amount: number;
  duration: number;
  purpose?: string;
  income?: number;
  request_status: "Pending" | "Approved" | "Rejected";
  requested_at: Date;
}
