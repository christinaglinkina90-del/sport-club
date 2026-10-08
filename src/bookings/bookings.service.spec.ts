import { Mocked } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { BookingsValidator } from './validation/bookings.validator';
import { UsersService } from '../users/users.service';
import { SchedulesService } from '../schedules/schedules.service';
import { UsersMapper } from '../users/dto/users.mapper';
import { SchedulesMapper } from '../schedules/dto/schedules.mapper';
import { ServicesMapper } from '../services/dto/services.mapper';
import { Booking } from './booking.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingDto } from './dto/booking.dto';
import { User } from '../users/user.entity';
import { Role } from '../users/enums/role.enum';
import { Schedule } from '../schedules/schedule.entity';
import { Service } from '../services/service.entity';
import { ServiceType } from '../services/enums/service-type.enum';
import { BookingException } from '../exceptions/types/booking.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';
import { AccessDeniedException } from '../exceptions/types/access-denied.exception';

describe('BookingsService', (): void => {
  const TOMORROW: string = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const YESTERDAY: string = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  let client: User;
  let otherClient: User;
  let schedule: Schedule;
  let booking: Booking;

  let service: BookingsService;
  let repository: Mocked<BookingsRepository>;
  let schedulesService: Mocked<SchedulesService>;

  function createUser(id: number): User {
    const user: User = new User();
    user.id = id;
    user.name = `Client${id}`;
    user.role = Role.CLIENT;
    user.active = true;
    return user;
  }

  beforeEach(async (): Promise<void> => {
    client = createUser(1);
    otherClient = createUser(2);

    const yoga: Service = new Service();
    yoga.id = 1;
    yoga.name = 'Yoga';
    yoga.type = ServiceType.YOGA;
    yoga.priceInCents = 1500;

    schedule = new Schedule();
    schedule.id = 10;
    schedule.service = yoga;
    schedule.trainer = createUser(3);
    schedule.date = TOMORROW as unknown as Date;
    schedule.startTime = '10:00:00';
    schedule.endTime = '11:00:00';
    schedule.capacity = 2;
    schedule.bookedCount = 0;
    schedule.active = true;

    booking = new Booking();
    booking.id = 100;
    booking.user = client;
    booking.schedule = schedule;
    booking.status = BookingStatus.PENDING;
    booking.active = true;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        BookingsMapper,
        BookingsValidator,
        UsersMapper,
        SchedulesMapper,
        ServicesMapper,
        {
          provide: BookingsRepository,
          useValue: {
            save: vi.fn(async (entity: Booking): Promise<Booking> => entity),
            findById: vi.fn(),
            isActiveBookingExists: vi.fn().mockResolvedValue(false),
            findAllActiveByScheduleId: vi.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getActiveEntityById: vi.fn(),
          },
        },
        {
          provide: SchedulesService,
          useValue: {
            getActiveEntityById: vi.fn(async (): Promise<Schedule> => schedule),
          },
        },
      ],
    }).compile();

    service = module.get(BookingsService);
    repository = module.get(BookingsRepository);
    schedulesService = module.get(SchedulesService);

    repository.findById.mockImplementation(
      async (id: number): Promise<Booking | null> =>
        id === booking.id ? booking : null,
    );
  });

  describe('createForCurrentUser', (): void => {
    it('should create pending booking for current user', async (): Promise<void> => {
      const result: BookingDto = await service.createForCurrentUser(client, {
        scheduleId: schedule.id,
      });

      expect(result.status).toEqual(BookingStatus.PENDING);
      expect(result.user.id).toEqual(client.id);
      expect(schedulesService.getActiveEntityById).toHaveBeenCalledWith(
        schedule.id,
      );
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user: client,
          schedule,
          status: BookingStatus.PENDING,
          active: true,
        }),
      );
    });

    it('should throw exception when schedule is fully booked', async (): Promise<void> => {
      schedule.bookedCount = 2;

      const resultPromise: Promise<BookingDto> = service.createForCurrentUser(
        client,
        { scheduleId: schedule.id },
      );

      await expect(resultPromise).rejects.toThrow('fully booked');
      await expect(resultPromise).rejects.toBeInstanceOf(BookingException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw exception when user already booked the schedule', async (): Promise<void> => {
      schedule.bookedCount = 2;
      repository.isActiveBookingExists.mockResolvedValue(true);

      const resultPromise: Promise<BookingDto> = service.createForCurrentUser(
        client,
        { scheduleId: schedule.id },
      );

      await expect(resultPromise).rejects.toThrow('already has a booking');
      await expect(resultPromise).rejects.toBeInstanceOf(BookingException);
    });

    it('should throw exception when schedule has already taken place', async (): Promise<void> => {
      schedule.date = YESTERDAY as unknown as Date;

      const resultPromise: Promise<BookingDto> = service.createForCurrentUser(
        client,
        { scheduleId: schedule.id },
      );

      await expect(resultPromise).rejects.toThrow('already taken place');
      await expect(resultPromise).rejects.toBeInstanceOf(BookingException);
    });
  });

  describe('cancelByCurrentUser', (): void => {
    it('should cancel own booking', async (): Promise<void> => {
      await service.cancelByCurrentUser(client, booking.id);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: booking.id,
          status: BookingStatus.CANCELLED,
        }),
      );
    });

    it('should not reveal booking of another user', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.cancelByCurrentUser(
        otherClient,
        booking.id,
      );

      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw exception when booking is already cancelled', async (): Promise<void> => {
      booking.status = BookingStatus.CANCELLED;

      const resultPromise: Promise<void> = service.cancelByCurrentUser(
        client,
        booking.id,
      );

      await expect(resultPromise).rejects.toThrow('cannot be cancelled');
      await expect(resultPromise).rejects.toBeInstanceOf(EntityUpdateException);
    });
  });

  describe('trainer cabinet', (): void => {
    let trainer: User;
    let otherTrainer: User;

    beforeEach((): void => {
      trainer = createUser(3);
      trainer.role = Role.TRAINER;
      otherTrainer = createUser(4);
      otherTrainer.role = Role.TRAINER;
      schedule.trainer = trainer;
    });

    it('should mark attendance on own class that already took place', async (): Promise<void> => {
      schedule.date = YESTERDAY as unknown as Date;

      await service.setStatus(booking.id, BookingStatus.COMPLETED, trainer);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: booking.id,
          status: BookingStatus.COMPLETED,
        }),
      );
    });

    it('should not mark attendance for a future class', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.setStatus(
        booking.id,
        BookingStatus.NO_SHOW,
        trainer,
      );

      await expect(resultPromise).rejects.toThrow('day of the class');
      await expect(resultPromise).rejects.toBeInstanceOf(EntityUpdateException);
    });

    it('should not let a trainer change bookings of another trainer', async (): Promise<void> => {
      const resultPromise: Promise<void> = service.setStatus(
        booking.id,
        BookingStatus.CONFIRMED,
        otherTrainer,
      );

      await expect(resultPromise).rejects.toBeInstanceOf(AccessDeniedException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should return participants of own class only', async (): Promise<void> => {
      repository.findAllActiveByScheduleId.mockResolvedValue([booking]);

      const result: BookingDto[] = await service.getBookingsOfSchedule(
        schedule.id,
        trainer,
      );
      expect(result.map((b: BookingDto): number => b.id)).toEqual([booking.id]);

      await expect(
        service.getBookingsOfSchedule(schedule.id, otherTrainer),
      ).rejects.toBeInstanceOf(AccessDeniedException);
    });
  });
});
