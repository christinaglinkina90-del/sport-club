import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Booking } from '../bookings/booking.entity';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

interface BookedCountRow {
  scheduleId: number;
  count: string;
}

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
    const schedules: Schedule[] = await this.repository.find({
      where: { active: true },
      relations: {
        service: true,
        trainer: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    await this.fillBookedCount(schedules);
    return schedules;
  }

  async findById(id: number): Promise<Schedule | null> {
    const schedule: Schedule | null = await this.repository.findOne({
      where: { id },
      relations: {
        service: true,
        trainer: true,
      },
    });

    if (schedule) {
      await this.fillBookedCount([schedule]);
    }

    return schedule;
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  // Считает активные неотменённые брони одним запросом для всех занятий.
  private async fillBookedCount(schedules: Schedule[]): Promise<void> {
    if (schedules.length === 0) {
      return;
    }

    const ids: number[] = schedules.map((s: Schedule): number => s.id);

    const rows: BookedCountRow[] = await this.repository.manager
      .createQueryBuilder(Booking, 'booking')
      .select('booking.schedule_id', 'scheduleId')
      .addSelect('COUNT(*)', 'count')
      .where({ schedule: { id: In(ids) } })
      .andWhere('booking.active = :active', { active: true })
      .andWhere('booking.status != :cancelled', {
        cancelled: BookingStatus.CANCELLED,
      })
      .groupBy('booking.schedule_id')
      .getRawMany<BookedCountRow>();

    const countBySchedule: Map<number, number> = new Map<number, number>(
      rows.map((r: BookedCountRow): [number, number] => [
        Number(r.scheduleId),
        Number(r.count),
      ]),
    );

    schedules.forEach((s: Schedule): void => {
      s.bookedCount = countBySchedule.get(s.id) ?? 0;
    });
  }
}
