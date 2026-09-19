import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { Booking } from './booking.entity';
import { BookingDto } from './dto/booking.dto';
import { BookingSaveDto } from './dto/booking.save-dto';
import { BookingUpdateDto } from './dto/booking.update-dto';
import { BookingStatus } from './enum/booking-status.enum';
import { UsersService } from '../users/users.service';
import { SchedulesService } from '../schedule/schedules.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly repository: BookingsRepository,
    private readonly mapper: BookingsMapper,
    private readonly usersService: UsersService,
    private readonly schedulesService: SchedulesService,
  ) {}

  async create(dto: BookingSaveDto): Promise<BookingDto> {
    const user = await this.usersService.getActiveEntityById(dto.userId);
    const schedule = await this.schedulesService.getActiveEntityById(
      dto.scheduleId,
    );

    const entity = new Booking();
    entity.user = user;
    entity.schedule = schedule;
    entity.status = BookingStatus.PENDING;

    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllBookings(): Promise<BookingDto[]> {
    const bookings = await this.repository.findAll();
    return this.mapper.mapEntityListToDtoList(bookings);
  }

  async getBookingById(id: number): Promise<BookingDto> {
    const booking = await this.repository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return this.mapper.mapEntityToDto(booking);
  }

  async updateStatus(id: number, dto: BookingUpdateDto): Promise<void> {
    const booking = await this.repository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (dto.status) {
      booking.status = dto.status;
      await this.repository.save(booking);
    }
  }

  async delete(id: number): Promise<void> {
    const booking = await this.repository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
