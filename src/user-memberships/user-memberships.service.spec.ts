import { Mocked } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserMembershipsService } from './user-memberships.service';
import { UserMembershipsRepository } from './user-memberships.repository';
import { UserMembershipsMapper } from './dto/user-memberships.mapper';
import { UserMembershipsValidator } from './validation/user-memberships.validator';
import { UserMembership } from './user-membership.entity';
import { UserMembershipDto } from './dto/user-membership.dto';
import { MembershipStatus } from './enums/membership-status.enum';
import { UsersService } from '../users/users.service';
import { UsersMapper } from '../users/dto/users.mapper';
import { MembershipsService } from '../memberships/memberships.service';
import { MembershipsMapper } from '../memberships/dto/memberships.mapper';
import { PaymentsService } from '../payments/payments.service';
import { PaymentStatus } from '../payments/enums/payment-status.enum';
import { User } from '../users/user.entity';
import { Role } from '../users/enums/role.enum';
import { Membership } from '../memberships/membership.entity';
import { MembershipType } from '../memberships/enums/membership-type.enum';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

describe('UserMembershipsService', (): void => {
  let client: User;
  let otherClient: User;
  let membership: Membership;
  let pendingRequest: UserMembership;

  let service: UserMembershipsService;
  let repository: Mocked<UserMembershipsRepository>;
  let paymentsService: Mocked<PaymentsService>;

  function createUser(id: number): User {
    const user: User = new User();
    user.id = id;
    user.name = `Client${id}`;
    user.role = Role.CLIENT;
    user.active = true;
    return user;
  }

  function today(): Date {
    const date: Date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Календарные дни, а не 24 часа: при переходе на зимнее время сутки длиннее.
  function addDays(date: Date, days: number): Date {
    const result: Date = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  beforeEach(async (): Promise<void> => {
    client = createUser(1);
    otherClient = createUser(2);

    membership = new Membership();
    membership.id = 5;
    membership.name = 'Gold';
    membership.type = MembershipType.GOLD;
    membership.priceInCents = 4990;
    membership.durationInDays = 30;
    membership.active = true;

    pendingRequest = new UserMembership();
    pendingRequest.id = 50;
    pendingRequest.user = client;
    pendingRequest.membership = membership;
    pendingRequest.status = MembershipStatus.PENDING;
    pendingRequest.startDate = today();
    pendingRequest.endDate = addDays(today(), 29);
    pendingRequest.active = true;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMembershipsService,
        UserMembershipsMapper,
        UserMembershipsValidator,
        UsersMapper,
        MembershipsMapper,
        {
          provide: UserMembershipsRepository,
          useValue: {
            save: vi.fn(
              async (entity: UserMembership): Promise<UserMembership> => {
                entity.id = entity.id ?? 60;
                return entity;
              },
            ),
            findById: vi.fn(
              async (id: number): Promise<UserMembership | null> =>
                id === pendingRequest.id ? pendingRequest : null,
            ),
            findLatestValidByUserId: vi.fn().mockResolvedValue(null),
            isPeriodOverlapExists: vi.fn().mockResolvedValue(false),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getActiveEntityById: vi.fn(),
          },
        },
        {
          provide: MembershipsService,
          useValue: {
            getActiveEntityById: vi.fn(
              async (): Promise<Membership> => membership,
            ),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            createForUserMembership: vi.fn(),
            setStatusForUserMembership: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UserMembershipsService);
    repository = module.get(UserMembershipsRepository);
    paymentsService = module.get(PaymentsService);
  });

  describe('requestForCurrentUser', (): void => {
    it('should create pending membership from today and a pending payment', async (): Promise<void> => {
      const result: UserMembershipDto = await service.requestForCurrentUser(
        client,
        { membershipId: membership.id },
      );

      expect(result.status).toEqual(MembershipStatus.PENDING);

      const saved: UserMembership = repository.save.mock.calls[0][0];
      expect(saved.user).toBe(client);
      expect(saved.startDate.getTime()).toEqual(today().getTime());
      expect(saved.endDate.getTime()).toEqual(addDays(today(), 29).getTime());
      expect(paymentsService.createForUserMembership).toHaveBeenCalledWith(
        saved,
      );
    });

    it('should start the day after the current membership ends', async (): Promise<void> => {
      const currentEnd: Date = addDays(today(), 10);
      const current: UserMembership = new UserMembership();
      current.endDate = currentEnd;
      repository.findLatestValidByUserId.mockResolvedValue(current);

      await service.requestForCurrentUser(client, {
        membershipId: membership.id,
      });

      const saved: UserMembership = repository.save.mock.calls[0][0];
      expect(saved.startDate.getTime()).toEqual(
        addDays(currentEnd, 1).getTime(),
      );
    });
  });

  describe('confirm and reject', (): void => {
    it('should activate membership and mark payment as paid', async (): Promise<void> => {
      await service.confirm(pendingRequest.id);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: pendingRequest.id,
          status: MembershipStatus.ACTIVE,
        }),
      );
      expect(paymentsService.setStatusForUserMembership).toHaveBeenCalledWith(
        pendingRequest.id,
        PaymentStatus.PAID,
      );
    });

    it('should cancel membership and mark payment as failed on reject', async (): Promise<void> => {
      await service.reject(pendingRequest.id);

      expect(pendingRequest.status).toEqual(MembershipStatus.CANCELLED);
      expect(paymentsService.setStatusForUserMembership).toHaveBeenCalledWith(
        pendingRequest.id,
        PaymentStatus.FAILED,
      );
    });

    it('should not confirm membership that is not pending', async (): Promise<void> => {
      pendingRequest.status = MembershipStatus.ACTIVE;

      const resultPromise: Promise<void> = service.confirm(pendingRequest.id);

      await expect(resultPromise).rejects.toThrow('not waiting for payment');
      await expect(resultPromise).rejects.toBeInstanceOf(EntityUpdateException);
      expect(paymentsService.setStatusForUserMembership).not.toHaveBeenCalled();
    });
  });

  describe('cancelByCurrentUser', (): void => {
    it('should cancel own pending request', async (): Promise<void> => {
      await service.cancelByCurrentUser(client, pendingRequest.id);

      expect(pendingRequest.status).toEqual(MembershipStatus.CANCELLED);
      expect(paymentsService.setStatusForUserMembership).toHaveBeenCalledWith(
        pendingRequest.id,
        PaymentStatus.FAILED,
      );
    });

    it('should not reveal membership of another user', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.cancelByCurrentUser(
        otherClient,
        pendingRequest.id,
      );

      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
