import { pool } from "../../config/db";
import { Repayment } from "./repayments.model";

export class RepaymentsRepository {
  async create(data: Omit<Repayment, "repayment_id">): Promise<Repayment> {
    const query = `
      INSERT INTO repayments (loan_id, scheduled_date, paid_amount, status, transaction_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.loan_id,
      data.scheduled_date,
      data.paid_amount,
      data.status ?? 'Missed',
      data.transaction_id ?? null
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(id: number): Promise<Repayment | null> {
    const { rows } = await pool.query("SELECT * FROM repayments WHERE repayment_id = $1", [id]);
    return rows[0] || null;
  }

  async findByLoanId(loanId: number): Promise<Repayment[]> {
    const { rows } = await pool.query("SELECT * FROM repayments WHERE loan_id = $1 ORDER BY scheduled_date ASC", [loanId]);
    return rows;
  }

  async update(id: number, data: Partial<Repayment>): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in data) {
      sets.push(`${key} = $${index}`);
      values.push((data as any)[key]);
      index++;
    }
    values.push(id);

    await pool.query(`UPDATE repayments SET ${sets.join(', ')} WHERE repayment_id = $${index}`, values);
  }

  async markAsPaid(repaymentId: number, transactionId: number, amount: number, paidDate: Date): Promise<void> {
    await this.update(repaymentId, {
      paid_amount: amount,
      paid_date: paidDate,
      transaction_id: transactionId,
      status: 'Paid'
    });
  }
}
