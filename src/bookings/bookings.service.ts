import { Injectable, Logger } from '@nestjs/common';
import { Booking } from './booking.entity';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { BookingSaveDto } from './dto/booking.save-dto';
import { MyBookingSaveDto } from './dto/my-booking.save-dto';
import { BookingDto } from './dto/booking.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingsValidator } from './validation/bookings.validator';
import { UsersService } from '../users/users.service';
import { SchedulesService } from '../schedules/schedules.service';
import { User } from '../users/user.entity';
import { Schedule } from '../schedules/schedule.entity';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';
import { BookingException } from '../exceptions/types/booking.exception';
import { AccessDeniedException } from '../exceptions/types/access-denied.exception';
import { Role } from '../users/enums/role.enum';

@Injectable()
export class BookingsService {
  private readonly logger: Logger = new Logger(BookingsService.name);

  constructor(
    private readonly repository: BookingsRepository,
    private readonly usersService: UsersService,
    private readonly schedulesService: SchedulesService,
    private readonly mapper: BookingsMapper,
    private readonly validator: BookingsValidator,
  ) {}

  async create(saveDto: BookingSaveDto): Promise<BookingDto> {
    this.validator.validateSaveDto(saveDto);

    const user: User = await this.usersService.getActiveEntityById(
      saveDto.userId,
    );
    const schedule: Schedule = await this.schedulesService.getActiveEntityById(
      saveDto.scheduleId,
    );

    return this.createBooking(user, schedule);
  }

  async createForCurrentUser(
    user: User,
    saveDto: MyBookingSaveDto,
  ): Promise<BookingDto> {
    this.validator.validateMyBookingSaveDto(saveDto);

    const schedule: Schedule = await this.schedulesService.getActiveEntityById(
      saveDto.scheduleId,
    );

    return this.createBooking(user, schedule);
  }

  private async createBooking(
    user: User,
    schedule: Schedule,
  ): Promise<BookingDto> {
    if (this.toDateString(schedule.date) < this.toDateString(new Date())) {
      throw new BookingException(
        `Schedule id ${schedule.id} has already taken place`,
      );
    }

    if (await this.repository.isActiveBookingExists(user.id, schedule.id)) {
      throw new BookingException(
        `User id ${user.id} already has a booking for schedule id ${schedule.id}`,
      );
    }

    if ((schedule.bookedCount ?? 0) >= schedule.capacity) {
      throw new BookingException(`Schedule id ${schedule.id} is fully booked`);
    }

    const entity: Booking = new Booking();
    entity.user = user;
    entity.schedule = schedule;
    entity.status = BookingStatus.PENDING;
    entity.createdAt = new Date();
    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(
      `Booking created: id ${entity.id}, user id ${user.id}, schedule id ${schedule.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  // Колонка schedule.date имеет тип date, и pg возвращает её строкой YYYY-MM-DD.
  private toDateString(date: Date | string): string {
    if (typeof date === 'string') {
      return date.slice(0, 10);
    }

    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getAllActiveBookings(): Promise<BookingDto[]> {
    const bookings: Booking[] = await this.repository.findAllActive();

    if (bookings.length === 0) {
      throw new EntityNotFoundException(Booking.name);
    }

    return this.mapper.mapEntityListToDtoList(bookings);
  }

  async getActiveBookingsOfUser(user: User): Promise<BookingDto[]> {
    const bookings: Booking[] = await this.repository.findAllActiveByUserId(
      user.id,
    );

    if (bookings.length === 0) {
      throw new EntityNotFoundException(Booking.name);
    }

    return this.mapper.mapEntityListToDtoList(bookings);
  }

  async getActiveBookingById(id: number): Promise<BookingDto> {
    const booking: Booking = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(booking);
  }

  async getActiveEntityById(id: number): Promise<Booking> {
    const booking: Booking | null = await this.repository.findById(id);

    if (!booking || !booking.active) {
      throw new EntityNotFoundException(Booking.name, id);
    }

    return booking;
  }

  async getBookingsOfSchedule(
    scheduleId: number,
    user: User,
  ): Promise<BookingDto[]> {
    const schedule: Schedule =
      await this.schedulesService.getActiveEntityById(scheduleId);

    this.checkCanManageSchedule(schedule, user);

    // Пустой список для занятия - нормальная ситуация, поэтому без 404.
    const bookings: Booking[] =
      await this.repository.findAllActiveByScheduleId(scheduleId);

    return this.mapper.mapEntityListToDtoList(bookings);
  }

  async setStatus(
    id: number,
    status: BookingStatus,
    user: User,
  ): Promise<void> {
    const booking: Booking = await this.getActiveEntityById(id);

    this.checkCanManageSchedule(booking.schedule, user);

    const isAttendance: boolean =
      status === BookingStatus.COMPLETED || status === BookingStatus.NO_SHOW;

    if (
      isAttendance &&
      this.toDateString(booking.schedule.date) > this.toDateString(new Date())
    ) {
      throw new EntityUpdateException(
        `Attendance for booking id ${id} can be marked only on the day of the class or later`,
      );
    }

    if (booking.status === status) {
      throw new EntityUpdateException(
        `Booking id ${id} already has status ${status}`,
      );
    }

    booking.status = status;
    await this.repository.save(booking);

    this.logger.log(
      `Booking updated: id ${id}, new status ${status}, by user id ${user.id}`,
    );
  }

  // Тренер управляет записями только на своих занятиях, администратор - на любых.
  private checkCanManageSchedule(schedule: Schedule, user: User): void {
    if (user.role === Role.TRAINER && schedule.trainer.id !== user.id) {
      throw new AccessDeniedException(
        `Schedule id ${schedule.id} belongs to another trainer`,
      );
    }
  }

  async cancelByCurrentUser(user: User, id: number): Promise<void> {
    const booking: Booking = await this.getActiveEntityById(id);

    // Чужую бронь не показываем: для клиента её как будто нет.
    if (booking.user.id !== user.id) {
      throw new EntityNotFoundException(Booking.name, id);
    }

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.COMPLETED
    ) {
      throw new EntityUpdateException(
        `Booking id ${id} with status ${booking.status} cannot be cancelled`,
      );
    }

    booking.status = BookingStatus.CANCELLED;
    await this.repository.save(booking);

    this.logger.log(`Booking cancelled by user: id ${id}, user id ${user.id}`);
  }

  async deleteById(id: number): Promise<void> {
    const booking: Booking = await this.getActiveEntityById(id);
    booking.active = false;
    await this.repository.save(booking);

    this.logger.log(`Booking marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const booking: Booking | null = await this.repository.findById(id);

    if (!booking) {
      throw new EntityNotFoundException(Booking.name, id);
    }

    if (!booking.active) {
      booking.active = true;
      await this.repository.save(booking);

      this.logger.log(`Booking marked as active: id ${id}`);
    }
  }
}
