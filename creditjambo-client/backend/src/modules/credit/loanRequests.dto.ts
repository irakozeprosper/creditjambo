export interface CreateLoanRequestDTO {
  account_id: number;
  requested_amount: number;
  duration: number;
  purpose?: string;
  income?: number;
}

export interface UpdateLoanRequestStatusDTO {
  request_status: 'Pending' | 'Approved' | 'Rejected';
}
