import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipsRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly repository: Repository<Membership>,
  ) {}

  async save(membership: Membership): Promise<Membership> {
    return this.repository.save(membership);
  }

  async findAllActive(): Promise<Membership[]> {
    return this.repository.findBy({ isActive: true });
  }

  async findById(id: number): Promise<Membership | null> {
    return this.repository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
