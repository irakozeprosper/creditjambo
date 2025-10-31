import { UsersRepository } from "./users.repository";
import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { SavingsAccountsRepository } from "../savings_accounts/savingsAccounts.repository";

export class UsersService {
  private usersRepository = new UsersRepository();

  async getAllUsers() {
    return this.usersRepository.findAll();
  }

  async getUserById(id: number) {
    return this.usersRepository.findById(id);
  }

  async createUser(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.usersRepository.update(id, data);
  }

  async deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
