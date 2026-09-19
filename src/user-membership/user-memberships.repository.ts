import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMembership } from './user-membership.entity';
import { Repository } from 'typeorm';
import { News } from '../news/news.entity';

@Injectable()
export class UserMembershipsRepository {
  constructor(
    @InjectRepository(UserMembership)
    private readonly repository: Repository<UserMembership>,
  ) {}

  async save(userMembership: UserMembership): Promise<UserMembership> {
    return this.repository.create(userMembership);
  }

  async findAll(): Promise<UserMembership[]> {
    return this.repository.find({});
  }

  async findById(id: number): Promise<UserMembership | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    this.repository.delete(id);
  }
}