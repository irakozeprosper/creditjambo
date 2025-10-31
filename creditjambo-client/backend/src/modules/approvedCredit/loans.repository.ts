import { pool } from "../../config/db";
import { Loan } from "./loans.model";

export class LoansRepository {
  async create(
    data: Omit<Loan, "loan_id" | "disbursement_date" | "status">
  ): Promise<Loan> {
    const query = `
      INSERT INTO loans (account_id, request_id, disbursed_amount, total_repayable, due_date, approver_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.account_id,
      data.request_id,
      data.disbursed_amount,
      data.total_repayable,
      data.due_date,
      data.approver_id || null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(id: number): Promise<Loan | null> {
    const { rows } = await pool.query(
      "SELECT * FROM loans WHERE loan_id = $1 AND status = 'Active'",
      [id]
    );
    return rows[0] || null;
  }

  async findByAccountId(id: number): Promise<Loan | null> {
    const { rows } = await pool.query(
      "SELECT * FROM loans WHERE account_id = $1 AND status = 'Active'",
      [id]
    );
    return rows[0] || null;
  }
  async updatePaidAmount(
    loan_id: number,
    status: string,
    paid_amount: number
  ): Promise<void> {
    const query = `
      UPDATE loans
      SET paid_amount = COALESCE(paid_amount,0) + $1, status = $3
      WHERE loan_id = $2;
    `;
    await pool.query(query, [paid_amount, loan_id, status]);
  }
}
