import { Injectable, Logger } from '@nestjs/common';
import { UserMembership } from './user-membership.entity';
import { UserMembershipsRepository } from './user-memberships.repository';
import { UserMembershipsMapper } from './dto/user-memberships.mapper';
import { UserMembershipSaveDto } from './dto/user-membership.save-dto';
import { UserMembershipDto } from './dto/user-membership.dto';
import { MembershipStatus } from './enums/membership-status.enum';
import { UserMembershipsValidator } from './validation/user-memberships.validator';
import { UsersService } from '../users/users.service';
import { MembershipsService } from '../memberships/memberships.service';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

@Injectable()
export class UserMembershipsService {
  private readonly logger: Logger = new Logger(UserMembershipsService.name);

  constructor(
    private readonly repository: UserMembershipsRepository,
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    private readonly mapper: UserMembershipsMapper,
    private readonly validator: UserMembershipsValidator,
  ) {}

  async create(saveDto: UserMembershipSaveDto): Promise<UserMembershipDto> {
    this.validator.validateSaveDto(saveDto);

    if (
      await this.repository.isPeriodOverlapExists(
        saveDto.userId,
        saveDto.startDate,
        saveDto.endDate,
      )
    ) {
      throw new EntitySaveException(UserMembership.name, 'period');
    }

    const entity: UserMembership = this.mapper.mapDtoToEntity(saveDto);
    entity.user = await this.usersService.getActiveEntityById(saveDto.userId);
    entity.membership = await this.membershipsService.getActiveEntityById(
      saveDto.membershipId,
    );

    await this.repository.save(entity);

    this.logger.log(
      `UserMembership created: id ${entity.id}, user id ${entity.user.id}, membership id ${entity.membership.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllUserMemberships(): Promise<UserMembershipDto[]> {
    const userMemberships: UserMembership[] = await this.repository.findAll();

    if (userMemberships.length === 0) {
      throw new EntityNotFoundException(UserMembership.name);
    }

    return this.mapper.mapEntityListToDtoList(userMemberships);
  }

  async getUserMembershipById(id: number): Promise<UserMembershipDto> {
    const userMembership: UserMembership = await this.getEntityById(id);
    return this.mapper.mapEntityToDto(userMembership);
  }

  private async getEntityById(id: number): Promise<UserMembership> {
    const userMembership: UserMembership | null =
      await this.repository.findById(id);

    if (!userMembership) {
      throw new EntityNotFoundException(UserMembership.name, id);
    }

    return userMembership;
  }

  async setStatus(id: number, status: MembershipStatus): Promise<void> {
    const userMembership: UserMembership = await this.getEntityById(id);

    if (userMembership.status === status) {
      throw new EntityUpdateException(
        `UserMembership id ${id} already has status ${status}`,
      );
    }

    userMembership.status = status;
    await this.repository.save(userMembership);

    this.logger.log(`UserMembership updated: id ${id}, new status ${status}`);
  }

  async deleteById(id: number): Promise<void> {
    await this.getEntityById(id);
    await this.repository.deleteById(id);

    this.logger.log(`UserMembership deleted: id ${id}`);
  }
}
