import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity.js';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly repository: Repository<Schedule>,
  ) {}

  async save(schedule: Schedule): Promise<Schedule> {
    return this.repository.save(schedule);}

  async findAll(): Promise<Schedule[]> {
    return this.repository.find({
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Schedule | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
