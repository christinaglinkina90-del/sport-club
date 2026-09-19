import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class SchedulesRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly repository: Repository<Schedule>,
  ) {}

  async save(schedule: Schedule): Promise<Schedule> {
    return this.repository.save(schedule);
  }

  async findAllActive(): Promise<Schedule[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: { service: true, trainer: true },
    });
  }

  async findById(id: number): Promise<Schedule | null> {
    return this.repository.findOne({
      where: { id },
      relations: { service: true, trainer: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
