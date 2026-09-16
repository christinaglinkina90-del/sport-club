import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findAllActive(): Promise<User[]> {
    return this.repository.findBy({ active: true });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
