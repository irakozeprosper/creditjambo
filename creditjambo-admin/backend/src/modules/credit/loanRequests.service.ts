import { LoanRequestsRepository } from "./loanRequests.repository";
import { CreateLoanRequestDTO, UpdateLoanRequestStatusDTO } from "./loanRequests.dto";

const repo = new LoanRequestsRepository();

export class LoanRequestsService {
  async create(dto: CreateLoanRequestDTO) {
    // Optional: add business rules, e.g., max amount check from product
    return repo.create(dto);
  }

  async getAll() {
    return repo.findAll();
  }

  async getByStatus(status: string) {
    return repo.findByStatus(status);
  }

  async getById(id: number) {
    const request = await repo.findById(id);
    if (!request) throw new Error("Loan request not found");
    return request;
  }

  async getByUser(userId: number) {
    return repo.findByUserId(userId);
  }

  async updateStatus(id: number, dto: UpdateLoanRequestStatusDTO, approver_id: number) {
  return repo.updateStatus(id, dto.request_status, approver_id);
}

}
