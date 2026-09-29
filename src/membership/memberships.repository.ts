import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { MembershipType } from './enum/membership-type.enum';

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

  async findSimilar(name: string, type: MembershipType): Promise<Membership[]> {
    return this.repository.find({
      where: {
        name: name,
        type: type,
      }
    });
  }
}
