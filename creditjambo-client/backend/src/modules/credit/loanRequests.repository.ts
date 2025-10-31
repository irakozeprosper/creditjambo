import { pool } from "../../config/db";
import { LoanRequest } from "./loanRequests.model";

export class LoanRequestsRepository {
  async create(data: Omit<LoanRequest, "request_id" | "request_status" | "requested_at">): Promise<LoanRequest> {
    const query = `
      INSERT INTO loan_requests (account_id, requested_amount, duration, purpose, income)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [data.account_id, data.requested_amount, data.duration, data.purpose, data.income || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findAll(): Promise<LoanRequest[]> {
    const { rows } = await pool.query("SELECT * FROM loan_requests ORDER BY requested_at DESC");
    return rows;
  }

  async findAllApproved(): Promise<LoanRequest[]> {
    const { rows } = await pool.query("SELECT * FROM loan_requests WHERE request_status = 'Approved' ORDER BY requested_at DESC");
    return rows;
  }

  async findByUserId(userId: number): Promise<LoanRequest[]> {
    const { rows } = await pool.query("SELECT * FROM loan_requests WHERE user_id = $1 ORDER BY requested_at DESC", [userId]);
    return rows;
  }

}
