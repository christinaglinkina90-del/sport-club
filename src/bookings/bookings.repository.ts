import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

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
}
