import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(user: any): Promise<any> {
    return this.repository.save(user);
  }

  async getAllActiveUsers(): Promise<any[]> {
    return this.repository.findAllActive();
  }

  async getActiveUserById(id: number): Promise<any> {
    return this.repository.findById(id);
  }

  async update(id: number, data: any): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.deleteById(id);
  }
}
