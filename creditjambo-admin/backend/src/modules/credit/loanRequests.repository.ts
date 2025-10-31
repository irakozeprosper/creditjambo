import { pool } from "../../config/db";
import { LoanRequest } from "./loanRequests.model";

export class LoanRequestsRepository {
  async create(
    data: Omit<LoanRequest, "request_id" | "request_status" | "requested_at">
  ): Promise<LoanRequest> {
    const query = `
      INSERT INTO loan_requests (account_id, requested_amount, duration, purpose, income)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.account_id,
      data.requested_amount,
      data.duration,
      data.purpose,
      data.income || null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async findById(id: number): Promise<LoanRequest | null> {
    const { rows } = await pool.query(
      "SELECT * FROM loan_requests WHERE request_id = $1",
      [id]
    );
    return rows[0] || null;
  }

  async findByStatus(status: string): Promise<LoanRequest[]> {
    const { rows } = await pool.query(
      `SELECT
      l.request_id,
      a.account_number,
      u.first_name,
      u.last_name,
      l.requested_amount,
      l.requested_at,
      l.request_status,
      l.account_id,
      l.purpose,
      l.income,
      l.duration
      FROM loan_requests l
      JOIN savings_accounts a ON l.account_id = a.account_id
      JOIN users u ON a.user_id = u.user_id
      WHERE request_status = $1`,
      [status]
    );
    return rows;
  }

  async findAll(): Promise<LoanRequest[]> {
    const { rows } = await pool.query(
      `SELECT
      l.request_id,
      a.account_number,
      u.first_name,
      u.last_name,
      l.requested_amount,
      l.requested_at,
      l.request_status,
      l.account_id,
      l.purpose,
      l.income,
      l.duration
      FROM loan_requests l
      JOIN savings_accounts a ON l.account_id = a.account_id
      JOIN users u ON a.user_id = u.user_id ORDER BY requested_at DESC`
    );
    return rows;
  }

  async findByUserId(userId: number): Promise<LoanRequest[]> {
    const { rows } = await pool.query(
      "SELECT * FROM loan_requests WHERE user_id = $1 ORDER BY requested_at DESC",
      [userId]
    );
    return rows;
  }

  async updateStatus(
    request_id: number,
    request_status: LoanRequest["request_status"],
    approver_id?: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Update loan request status
      await client.query(
        "UPDATE loan_requests SET request_status = $1 WHERE request_id = $2",
        [request_status, request_id]
      );

      if (request_status === "Approved") {
        // 2. Fetch loan request details
        const { rows } = await client.query(
          "SELECT * FROM loan_requests WHERE request_id = $1",
          [request_id]
        );
        const request = rows[0];
        if (!request) throw new Error("Loan request not found");

        // 3. Retrieve account info
        const accountRes = await client.query(
          "SELECT * FROM savings_accounts WHERE account_id = $1",
          [request.account_id]
        );
        const account = accountRes.rows[0];
        if (!account) throw new Error("No savings account found for this user");

        // 4. Validate numbers
        const requestedAmount = Number(request.requested_amount);
        const durationMonths = Number(request.duration); // correct field
        if (
          isNaN(requestedAmount) ||
          isNaN(durationMonths) ||
          durationMonths <= 0
        ) {
          throw new Error(
            `Invalid requested amount or duration months: requestedAmount=${requestedAmount}, durationMonths=${durationMonths}`
          );
        }

        // 5. Create disbursement transaction
        const transactionRes = await client.query(
          `INSERT INTO transactions
          (account_id, type, amount, status, reference_number, transaction_date, source_destination_name, source_destination_account)
         VALUES ($1,$2,$3,$4,$5,NOW(),$6,$7)
         RETURNING transaction_id`,
          [
            account.account_id,
            "Disbursement", // lowercase to match your check constraint
            requestedAmount,
            "Completed",
            `DISB-${Date.now()}`,
            "CreditJambo",
            "0000000000",
          ]
        );
        const transaction_id = transactionRes.rows[0].transaction_id;

        // 6. Update account balance
        await client.query(
          `UPDATE savings_accounts 
         SET current_balance = current_balance + $1 
         WHERE account_id = $2`,
          [requestedAmount, account.account_id]
        );

        // 7. Compute total repayable with annual interest
        const interestRate = 0.18; // 18% per year
        const durationYears = durationMonths / 12; // convert months to years
        const totalRepayable =
          requestedAmount * (1 + interestRate * durationYears);

        // 8. Insert new loan record
        await client.query(
          `INSERT INTO loans
          (request_id, disbursed_amount, total_repayable, disbursement_date, due_date, status, approver_id, transaction_id, account_id)
         VALUES
          ($1,$2,$3,NOW(), NOW() + ($4)::interval,'Active',$5,$6,$7)`,
          [
            request.request_id,
            requestedAmount,
            totalRepayable,
            durationMonths,
            approver_id ?? null,
            transaction_id,
            account.account_id,
          ]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating loan request status:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
