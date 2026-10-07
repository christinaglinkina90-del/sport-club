import { Injectable, Logger } from '@nestjs/common';
import { Booking } from './booking.entity';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { BookingSaveDto } from './dto/booking.save-dto';
import { BookingDto } from './dto/booking.dto';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingsValidator } from './validation/bookings.validator';
import { UsersService } from '../users/users.service';
import { SchedulesService } from '../schedules/schedules.service';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

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
    const entity: Booking = new Booking();

    entity.user = await this.usersService.getActiveEntityById(saveDto.userId);
    entity.schedule = await this.schedulesService.getActiveEntityById(
      saveDto.scheduleId,
    );

    entity.status = BookingStatus.PENDING;
    await this.repository.save(entity);

    this.logger.log(
      `Booking created: id ${entity.id}, user id ${entity.user.id}, schedule id ${entity.schedule.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllBookings(): Promise<BookingDto[]> {
    const bookings: Booking[] = await this.repository.findAll();

    if (bookings.length === 0) {
      throw new EntityNotFoundException(Booking.name);
    }

    return this.mapper.mapEntityListToDtoList(bookings);
  }

  async getBookingById(id: number): Promise<BookingDto> {
    const booking: Booking = await this.getEntityById(id);
    return this.mapper.mapEntityToDto(booking);
  }

  async getEntityById(id: number): Promise<Booking> {
    const booking: Booking | null = await this.repository.findById(id);

    if (!booking) {
      throw new EntityNotFoundException(Booking.name, id);
    }

    return booking;
  }

  async setStatus(id: number, status: BookingStatus): Promise<void> {
    const booking: Booking = await this.getEntityById(id);

    if (booking.status === status) {
      throw new EntityUpdateException(
        `Booking id ${id} already has status ${status}`,
      );
    }

    booking.status = status;
    await this.repository.save(booking);

    this.logger.log(`Booking updated: id ${id}, new status ${status}`);
  }

  async deleteById(id: number): Promise<void> {
    await this.getEntityById(id);
    await this.repository.deleteById(id);

    this.logger.log(`Booking deleted: id ${id}`);
  }
}
