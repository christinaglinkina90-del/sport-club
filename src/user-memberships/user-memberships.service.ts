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
import { MyUserMembershipSaveDto } from './dto/my-user-membership.save-dto';
import { PaymentsService } from '../payments/payments.service';
import { PaymentStatus } from '../payments/enums/payment-status.enum';
import { User } from '../users/user.entity';
import { Membership } from '../memberships/membership.entity';

@Injectable()
export class UserMembershipsService {
  private readonly logger: Logger = new Logger(UserMembershipsService.name);

  constructor(
    private readonly repository: UserMembershipsRepository,
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    private readonly paymentsService: PaymentsService,
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

    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(
      `UserMembership created: id ${entity.id}, user id ${entity.user.id}, membership id ${entity.membership.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  // Заявка клиента: абонемент ждёт оплаты, пока администратор её не подтвердит.
  async requestForCurrentUser(
    user: User,
    saveDto: MyUserMembershipSaveDto,
  ): Promise<UserMembershipDto> {
    this.validator.validateMySaveDto(saveDto);

    const membership: Membership =
      await this.membershipsService.getActiveEntityById(saveDto.membershipId);

    const startDate: Date = await this.calculateStartDate(user.id);
    const endDate: Date = this.addDays(
      startDate,
      membership.durationInDays - 1,
    );

    if (
      await this.repository.isPeriodOverlapExists(user.id, startDate, endDate)
    ) {
      throw new EntitySaveException(UserMembership.name, 'period');
    }

    const entity: UserMembership = new UserMembership();
    entity.user = user;
    entity.membership = membership;
    entity.status = MembershipStatus.PENDING;
    entity.startDate = startDate;
    entity.endDate = endDate;
    entity.active = true;
    await this.repository.save(entity);

    await this.paymentsService.createForUserMembership(entity);

    this.logger.log(
      `UserMembership requested: id ${entity.id}, user id ${user.id}, membership id ${membership.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  // Новый абонемент начинается сегодня или на следующий день
  // после окончания текущего, если он ещё действует.
  private async calculateStartDate(userId: number): Promise<Date> {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const latest: UserMembership | null =
      await this.repository.findLatestValidByUserId(userId);

    if (latest && latest.endDate.getTime() >= today.getTime()) {
      const nextDay: Date = this.addDays(latest.endDate, 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    }

    return today;
  }

  private addDays(date: Date, days: number): Date {
    const result: Date = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  async getActiveUserMembershipsOfUser(
    user: User,
  ): Promise<UserMembershipDto[]> {
    const userMemberships: UserMembership[] =
      await this.repository.findAllActiveByUserId(user.id);

    if (userMemberships.length === 0) {
      throw new EntityNotFoundException(UserMembership.name);
    }

    return this.mapper.mapEntityListToDtoList(userMemberships);
  }

  async cancelByCurrentUser(user: User, id: number): Promise<void> {
    const userMembership: UserMembership = await this.getActiveEntityById(id);

    // Чужой абонемент не показываем: для клиента его как будто нет.
    if (userMembership.user.id !== user.id) {
      throw new EntityNotFoundException(UserMembership.name, id);
    }

    await this.closePendingRequest(userMembership, PaymentStatus.FAILED);

    this.logger.log(
      `UserMembership request cancelled by user: id ${id}, user id ${user.id}`,
    );
  }

  async confirm(id: number): Promise<void> {
    const userMembership: UserMembership = await this.getActiveEntityById(id);

    this.checkIsPending(userMembership);

    userMembership.status = MembershipStatus.ACTIVE;
    await this.repository.save(userMembership);
    await this.paymentsService.setStatusForUserMembership(
      id,
      PaymentStatus.PAID,
    );

    this.logger.log(`UserMembership confirmed: id ${id}`);
  }

  async reject(id: number): Promise<void> {
    const userMembership: UserMembership = await this.getActiveEntityById(id);

    await this.closePendingRequest(userMembership, PaymentStatus.FAILED);

    this.logger.log(`UserMembership rejected: id ${id}`);
  }

  private async closePendingRequest(
    userMembership: UserMembership,
    paymentStatus: PaymentStatus,
  ): Promise<void> {
    this.checkIsPending(userMembership);

    userMembership.status = MembershipStatus.CANCELLED;
    await this.repository.save(userMembership);
    await this.paymentsService.setStatusForUserMembership(
      userMembership.id,
      paymentStatus,
    );
  }

  private checkIsPending(userMembership: UserMembership): void {
    if (userMembership.status !== MembershipStatus.PENDING) {
      throw new EntityUpdateException(
        `UserMembership id ${userMembership.id} with status ${userMembership.status} is not waiting for payment`,
      );
    }
  }

  async getAllActiveUserMemberships(): Promise<UserMembershipDto[]> {
    const userMemberships: UserMembership[] =
      await this.repository.findAllActive();

    if (userMemberships.length === 0) {
      throw new EntityNotFoundException(UserMembership.name);
    }

    return this.mapper.mapEntityListToDtoList(userMemberships);
  }

  async getActiveUserMembershipById(id: number): Promise<UserMembershipDto> {
    const userMembership: UserMembership = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(userMembership);
  }

  private async getActiveEntityById(id: number): Promise<UserMembership> {
    const userMembership: UserMembership | null =
      await this.repository.findById(id);

    if (!userMembership || !userMembership.active) {
      throw new EntityNotFoundException(UserMembership.name, id);
    }

    return userMembership;
  }

  async setStatus(id: number, status: MembershipStatus): Promise<void> {
    const userMembership: UserMembership = await this.getActiveEntityById(id);

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
    const userMembership: UserMembership = await this.getActiveEntityById(id);
    userMembership.active = false;
    await this.repository.save(userMembership);

    this.logger.log(`UserMembership marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const userMembership: UserMembership | null =
      await this.repository.findById(id);

    if (!userMembership) {
      throw new EntityNotFoundException(UserMembership.name, id);
    }

    if (!userMembership.active) {
      userMembership.active = true;
      await this.repository.save(userMembership);

      this.logger.log(`UserMembership marked as active: id ${id}`);
    }
  }
}
