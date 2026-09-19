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

  async findAll(): Promise<Booking[]> {
    return this.repository.find({
      relations: { user: true, schedule: true },
    });
  }

  async findById(id: number): Promise<Booking | null> {
    return this.repository.findOne({
      where: { id },
      relations: { user: true, schedule: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
