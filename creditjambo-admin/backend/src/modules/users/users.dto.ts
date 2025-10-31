export interface CreateUserDto {
  user_id: any;
  first_name: string;
  last_name: string;
  email: string;
  password: string; 
  phone_number?: string;
  date_of_birth?: Date;
}
export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  status?: string;
  date_of_birth?: Date;
}
