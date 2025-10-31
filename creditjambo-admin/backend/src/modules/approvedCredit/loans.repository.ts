import { pool } from "../../config/db";
import { Loan } from "./loans.model";

export class LoansRepository {
  async create(data: Omit<Loan, "loan_id" | "disbursement_date" | "status">): Promise<Loan> {
    const left_to_repay = data.total_repayable;
    const query = `
      INSERT INTO loans (account_id, request_id, disbursed_amount, total_repayable, left_to_repay, due_date, approver_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [data.account_id, data.request_id, data.disbursed_amount, data.total_repayable, left_to_repay, data.due_date, data.approver_id || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(id: number): Promise<Loan | null> {
    const { rows } = await pool.query("SELECT * FROM loans WHERE loan_id = $1", [id]);
    return rows[0] || null;
  }

  async findAll(): Promise<Loan[]> {
    const { rows } = await pool.query("SELECT * FROM loans ORDER BY disbursement_date DESC");
    return rows;
  }

  async findByRequestId(requestId: number): Promise<Loan | null> {
    const { rows } = await pool.query("SELECT * FROM loans WHERE request_id = $1", [requestId]);
    return rows[0] || null;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await pool.query("UPDATE loans SET status = $1 WHERE loan_id = $2", [status, id]);
  }

   async getLoanByAccountId(accountId: number): Promise<Loan | null> {
    const query = `
      SELECT *
      FROM loans
      WHERE account_id = $1 AND status = 'Active'
      ORDER BY disbursement_date DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [accountId]);
    return rows[0] || null;
  }
}
