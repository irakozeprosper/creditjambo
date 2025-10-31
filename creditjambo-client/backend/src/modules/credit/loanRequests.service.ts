import { LoanRequestsRepository } from "./loanRequests.repository";
import { CreateLoanRequestDTO, UpdateLoanRequestStatusDTO } from "./loanRequests.dto";

const repo = new LoanRequestsRepository();

export class LoanRequestsService {
  async create(dto: CreateLoanRequestDTO) {
    return repo.create(dto);
  }

  async getAll() {
    return repo.findAll();
  }

  async getAllApproved() {
    return repo.findAllApproved();
  }

  async getByUser(userId: number) {
    return repo.findByUserId(userId);
  }

}
