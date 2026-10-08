import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
  ) {}

  async save(booking: Booking): Promise<Booking> {
    return this.repository.save(booking);
  }

  async findAllActive(): Promise<Booking[]> {
    return this.repository.find({
      where: { active: true },
      relations: {
        user: true,
        schedule: {
          service: true,
          trainer: true,
        },
      },
    });
  }

  async findAllActiveByUserId(userId: number): Promise<Booking[]> {
    return this.repository.find({
      where: {
        active: true,
        user: { id: userId },
      },
      relations: {
        user: true,
        schedule: {
          service: true,
          trainer: true,
        },
      },
      order: {
        schedule: {
          date: 'ASC',
          startTime: 'ASC',
        },
      },
    });
  }

  async findById(id: number): Promise<Booking | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        user: true,
        schedule: {
          service: true,
          trainer: true,
        },
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async isActiveBookingExists(
    userId: number,
    scheduleId: number,
  ): Promise<boolean> {
    return this.repository.existsBy({
      active: true,
      status: Not(BookingStatus.CANCELLED),
      user: { id: userId },
      schedule: { id: scheduleId },
    });
  }
}
