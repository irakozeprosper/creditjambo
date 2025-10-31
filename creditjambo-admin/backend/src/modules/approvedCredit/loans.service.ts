import { LoansRepository } from "./loans.repository";
import { LoanRequestsRepository } from "../credit/loanRequests.repository";
import { RepaymentsRepository } from "../repayments/repayments.repository";
import { CreateLoanDTO, UpdateLoanStatusDTO } from "./loans.dto";

const loansRepo = new LoansRepository();
const requestsRepo = new LoanRequestsRepository();
const repaymentsRepo = new RepaymentsRepository();

export class LoansService {
  async disburseLoan(dto: CreateLoanDTO) {
    // 1. Verify loan request exists and is approved
    const request = await requestsRepo.findById(dto.request_id);
    if (!request) throw new Error("Loan request not found");
    if (request.request_status !== "Approved") throw new Error("Loan request is not approved");

    // 2. Check if loan already disbursed
    const existingLoan = await loansRepo.findByRequestId(dto.request_id);
    if (existingLoan) throw new Error("Loan already disbursed for this request");

    // 3. Create loan
    const loan = await loansRepo.create(dto);

    // 4. Generate repayment schedule (example: monthly)
    const months = request.duration;
    const installmentAmount = loan.total_repayable / months;

    const scheduledDates: Date[] = [];
    const startDate = new Date(loan.disbursement_date || new Date());
    for (let i = 1; i <= months; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      scheduledDates.push(date);
    }

    // 5. Insert repayment schedule
    for (const date of scheduledDates) {
      await repaymentsRepo.create({
        loan_id: loan.loan_id,
        scheduled_date: date,
        paid_amount: 0,
        status: "Missed",
        transaction_id: null,
      });
    }

    return loan;
  }

  async getAll() {
    return loansRepo.findAll();
  }

  async getById(id: number) {
    const loan = await loansRepo.findById(id);
    if (!loan) throw new Error("Loan not found");
    return loan;
  }

  async updateStatus(id: number, dto: UpdateLoanStatusDTO) {
    const loan = await loansRepo.findById(id);
    if (!loan) throw new Error("Loan not found");
    await loansRepo.updateStatus(id, dto.status);
    return loansRepo.findById(id);
  }

  async getLoanByAccountId(accountId: number) {
    const loan = await loansRepo.getLoanByAccountId(accountId);
    if (!loan) {
      return { hasActiveLoan: false, loan: null };
    }

    return { hasActiveLoan: true, loan };
  }
}
