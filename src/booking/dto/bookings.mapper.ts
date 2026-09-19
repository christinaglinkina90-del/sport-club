import { Injectable } from '@nestjs/common';

import { BookingDto } from './booking.dto';
import { Booking } from '../booking.entity';

@Injectable()
export class BookingsMapper {
  mapEntityToDto(entity: Booking): BookingDto {
    const dto = new BookingDto();
    dto.id = entity.id;
    dto.userId = entity.user.id;
    dto.scheduleId = entity.schedule.id;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  mapEntityListToDtoList(entityList: Booking[]): BookingDto[] {
    if (!entityList) return [];
    return entityList.map((b) => this.mapEntityToDto(b));
  }
}
