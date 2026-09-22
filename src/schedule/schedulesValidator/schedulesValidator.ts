import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleSaveDto } from '../dto/schedule.save-dto';
import { ScheduleUpdateDto } from '../dto/schedule.update-dto';

@Injectable()
export class SchedulesValidator {
  validateSaveDto(dto: ScheduleSaveDto): void {
    if (!dto) {
      throw new BadRequestException('DTO is empty');
    }

    // 1. Дата не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(dto.date);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      throw new BadRequestException('Schedule date cannot be in the past');
    }

    // 2. endTime > startTime
    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('End time must be after start time');
    }
  }

  validateUpdateDto(dto: ScheduleUpdateDto): void {
    if (!dto) {
      throw new BadRequestException('DTO is empty');
    }

    // Если передали и startTime, и endTime — проверяем
    if (dto.startTime && dto.endTime) {
      if (dto.endTime <= dto.startTime) {
        throw new BadRequestException('End time must be after start time');
      }
    }

    // Если передали date — проверяем, что не в прошлом
    if (dto.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scheduleDate = new Date(dto.date);
      scheduleDate.setHours(0, 0, 0, 0);

      if (scheduleDate < today) {
        throw new BadRequestException('Schedule date cannot be in the past');
      }
    }
  }
}
