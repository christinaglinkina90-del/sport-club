import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { UserMembership } from './user-membership.entity';
import { MembershipStatus } from './enums/membership-status.enum';

@Injectable()
export class UserMembershipsRepository {
  constructor(
    @InjectRepository(UserMembership)
    private readonly repository: Repository<UserMembership>,
  ) {}

  async save(userMembership: UserMembership): Promise<UserMembership> {
    return this.repository.save(userMembership);
  }

  async findAllActive(): Promise<UserMembership[]> {
    return this.repository.find({
      where: { active: true },
      relations: {
        user: true,
        membership: true,
      },
    });
  }

  async findById(id: number): Promise<UserMembership | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        user: true,
        membership: true,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async isPeriodOverlapExists(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    return this.repository.existsBy({
      user: { id: userId },
      active: true,
      status: Not(MembershipStatus.CANCELLED),
      startDate: LessThanOrEqual(endDate),
      endDate: MoreThanOrEqual(startDate),
    });
  }
}
