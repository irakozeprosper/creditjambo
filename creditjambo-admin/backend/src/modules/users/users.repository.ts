import { pool } from "../../config/db";
import { User } from "./users.model";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import bcrypt from "bcrypt";

export class UsersRepository {
  async findAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id ASC");
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  async create(data: CreateUserDto): Promise<User> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // ✅ 1. Hash password
      const password_hash = await bcrypt.hash(data.password, 10);

      // ✅ 2. Insert new user
      const userResult = await client.query(
        `
        INSERT INTO users (first_name, last_name, email, password_hash, phone_number, date_of_birth)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
          data.first_name,
          data.last_name,
          data.email,
          password_hash,
          data.phone_number || null,
          data.date_of_birth || null,
        ]
      );

      const newUser = userResult.rows[0];

      // ✅ 3. Generate a unique, incrementing account number
      const accNumberResult = await client.query(`
        SELECT account_number FROM savings_accounts ORDER BY account_number DESC LIMIT 1
      `);

      let newAccountNumber: string;
      if (accNumberResult.rows.length > 0) {
        // Increment last account number by 1
        const lastAccount = parseInt(
          accNumberResult.rows[0].account_number,
          10
        );
        newAccountNumber = (lastAccount + 1).toString().padStart(10, "0"); // e.g., "0000000124"
      } else {
        // First account
        newAccountNumber = "0000000001";
      }

      // ✅ 4. Create a savings account with 0 balance
      await client.query(
        `
        INSERT INTO savings_accounts (user_id, account_number, current_balance, is_active)
        VALUES ($1, $2, $3, $4)
        `,
        [newUser.user_id, newAccountNumber, 0, true]
      );

      await client.query("COMMIT");
      return newUser;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating user and savings account:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<User | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `
      UPDATE users
      SET ${setClause}
      WHERE user_id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0; // ✅ Safe handling of possible null
  }

  async deactivateUser(id: number): Promise<boolean> {
    const result = await pool.query(
      "UPDATE users SET status = 'Inactive' WHERE user_id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0; // ✅ Safe handling of possible null
  }

  async activateUser(id: number): Promise<boolean> {
    const result = await pool.query(
      "UPDATE users SET status = 'Active' WHERE user_id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0; // ✅ Safe handling of possible null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }
}
