import { LoansRepository } from "./loans.repository";
import { Loan } from "./loans.model";

const loansRepo = new LoansRepository();

export class LoansService {
  // Create a new loan
  async createLoan(
    data: Omit<Loan, "loan_id" | "disbursement_date" | "status">
  ) {
    return await loansRepo.create(data);
  }

  // Update paid amount for a specific loan
  async updateLoanPaidAmount(
    loan_id: number,
    status: string,
    paid_amount: number
  ) {
    return await loansRepo.updatePaidAmount(loan_id, status, paid_amount);
  }
  async getActiveLoanByAccount(account_id: number) {
    const loan = await loansRepo.findByAccountId(account_id);
    return loan || null;
  }
}
