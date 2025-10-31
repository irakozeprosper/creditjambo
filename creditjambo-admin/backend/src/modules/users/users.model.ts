export interface User {
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  date_of_birth?: Date;
  status?: string;
  created_at?: Date;
  role?: string;
}
