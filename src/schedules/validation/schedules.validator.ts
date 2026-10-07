import { Injectable } from '@nestjs/common';
import { ScheduleSaveDto } from '../dto/schedule.save-dto';
import { ScheduleUpdateDto } from '../dto/schedule.update-dto';

@Injectable()
export class SchedulesValidator {
  validateSaveDto(saveDto: ScheduleSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const serviceId: number = saveDto.serviceId;
    if (!serviceId || serviceId < 1) {
      throw Error();
    }

    const trainerId: number = saveDto.trainerId;
    if (!trainerId || trainerId < 1) {
      throw Error();
    }

    const date: Date = saveDto.date;
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    if (!date || date.getTime() < today.getTime()) {
      throw Error();
    }

    const startTime: string = saveDto.startTime;
    const endTime: string = saveDto.endTime;
    if (!startTime || !endTime || endTime <= startTime) {
      throw Error();
    }

    const capacity: number = saveDto.capacity;
    if (!capacity || capacity < 1 || capacity > 100) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: ScheduleUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    const startTime: string | undefined = updateDto.newStartTime;
    const endTime: string | undefined = updateDto.newEndTime;
    if (startTime && endTime && endTime <= startTime) {
      throw Error();
    }

    const capacity: number | undefined = updateDto.newCapacity;
    if (capacity !== undefined && (capacity < 1 || capacity > 100)) {
      throw Error();
    }
  }
}
