import { RepaymentsRepository } from "./repayments.repository";
import { LoansRepository } from "../approvedCredit/loans.repository";
import { CreateRepaymentDTO, UpdateRepaymentDTO } from "./repayments.dto";

const repaymentsRepo = new RepaymentsRepository();
const loansRepo = new LoansRepository();

export class RepaymentsService {
  async create(dto: CreateRepaymentDTO) {
  return repaymentsRepo.create({
    ...dto,
    status: dto.status ?? 'Missed',
  });
}

  async getByLoan(loanId: number) {
    return repaymentsRepo.findByLoanId(loanId);
  }

  async getById(id: number) {
    const repayment = await repaymentsRepo.findById(id);
    if (!repayment) throw new Error("Repayment not found");
    return repayment;
  }

  async recordPayment(repaymentId: number, dto: UpdateRepaymentDTO) {
    // Update repayment
    await repaymentsRepo.markAsPaid(repaymentId, dto.transaction_id, dto.paid_amount, dto.paid_date);

    // Check if all repayments are paid for this loan
    const repayment = await repaymentsRepo.findById(repaymentId);
    if (!repayment) throw new Error("Repayment not found after update");

    const allRepayments = await repaymentsRepo.findByLoanId(repayment.loan_id);
    const allPaid = allRepayments.every(r => r.status === 'Paid');

    if (allPaid) {
      // Mark loan as Paid
      await loansRepo.updateStatus(repayment.loan_id, 'Paid');
    }

    return repaymentsRepo.findById(repaymentId);
  }
}
