import { Injectable, Logger } from '@nestjs/common';
import { UserMembershipsRepository } from './user-memberships.repository';
import { UserMembershipMapper } from './dto/user-membership.mapper';
import { UserMembershipSaveDto } from './dto/user-membership.save-dto';
import { UserMembership } from './user-membership.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Membership } from '../membership/membership.entity';
import { MembershipsService } from '../membership/memberships.service';
import { UserMembershipDto } from './dto/user-membership.dto';
import { EntityNotFoundError } from 'typeorm';
import { MembershipStatus } from './enum/membership-status.enum';
import { UserMembershipValidator } from './validator/user-membership.validator';

@Injectable()
export class UserMembershipsService {
  private readonly logger: Logger = new Logger(UserMembershipsService.name);

  constructor(
    private readonly userMemberShipRepository: UserMembershipsRepository,
    private readonly userMembershipMapper: UserMembershipMapper,
    private readonly userService: UsersService,
    private readonly membershipService: MembershipsService,
    private readonly validator: UserMembershipValidator,
  ) {}

  async create(
    uMemShipSaveDto: UserMembershipSaveDto,
  ): Promise<UserMembershipDto> {
    this.validator.validateSaveDto(uMemShipSaveDto);
    const user: User = await this.userService.getActiveEntityById(
      uMemShipSaveDto.userId,
    );
    const membership: Membership =
      await this.membershipService.getActiveEntityById(
        uMemShipSaveDto.membershipId,
      );
    const entity: UserMembership = this.userMembershipMapper.mapDtoToEntity(
      uMemShipSaveDto,
      user,
      membership,
    );
    await this.userMemberShipRepository.save(entity);

    this.logger.log(
      `UserMembership created: id ${entity.id}, userId ${user.id}, membershipId ${membership.id}, status ${entity.status}`,
    );

    return this.userMembershipMapper.mapEntityToDto(entity);
  }

  async getAllUserMemberships(): Promise<UserMembershipDto[]> {
    const entities: UserMembership[] =
      await this.userMemberShipRepository.findAll();
    if (entities.length === 0) {
      throw new EntityNotFoundError(UserMembership.name, '');
    }
    return this.userMembershipMapper.mapEntityListToDtoList(entities);
  }

  async getUserMembershipById(id: number): Promise<UserMembershipDto> {
    const userMembership: UserMembership = await this.getEntityById(id);
    return this.userMembershipMapper.mapEntityToDto(userMembership);
  }

  private async getEntityById(id: number): Promise<UserMembership> {
    const userMembership: UserMembership | null =
      await this.userMemberShipRepository.findById(id);

    if (!userMembership) {
      throw new EntityNotFoundError(UserMembership.name, id);
    }

    return userMembership;
  }

  async deleteById(id: number): Promise<void> {
    await this.userMemberShipRepository.delete(id);

    this.logger.log(`UserMembership deleted: id ${id}`);
  }

  async update(id: number, newStatus: MembershipStatus): Promise<void> {
    const foundUserMembership: UserMembership | null =
      await this.userMemberShipRepository.findById(id);

    if (foundUserMembership) {
      const oldStatus = foundUserMembership.status;
      foundUserMembership.status = newStatus;
      await this.userMemberShipRepository.save(foundUserMembership);

      this.logger.log(
        `UserMembership status changed: id ${id}, ${oldStatus} -> ${foundUserMembership.status}`,
      );
    } else {
      throw new EntityNotFoundError(UserMembership.name, id);
    }
  }
}
