import { pool } from "../../config/db";
import { Repayment } from "./repayments.model";

export class RepaymentsRepository {
  async create(loan_id: number, amount: number, transaction_id: number) {
    const query = `
      INSERT INTO repayments (loan_id, paid_amount, paid_date, status, transaction_id)
      VALUES ($1, $2, NOW(), $3, $4)
      RETURNING *;
    `;
    const values = [loan_id, amount, "Paid", transaction_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findByLoanId(loan_id: number): Promise<Repayment[]> {
    const { rows } = await pool.query(
      "SELECT * FROM repayments WHERE loan_id = $1",
      [loan_id]
    );
    return rows;
  }

  async findAll(): Promise<Repayment[]> {
    const { rows } = await pool.query(
      "SELECT * FROM repayments ORDER BY paid_date DESC"
    );
    return rows;
  }
}
