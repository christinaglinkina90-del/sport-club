import { Injectable } from '@nestjs/common';
import { Booking } from '../booking.entity';
import { BookingDto } from './booking.dto';
import { UsersMapper } from '../../users/dto/users.mapper';
import { SchedulesMapper } from '../../schedules/dto/schedules.mapper';

@Injectable()
export class BookingsMapper {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly schedulesMapper: SchedulesMapper,
  ) {}

  mapEntityToDto(entity: Booking): BookingDto {
    const dto: BookingDto = new BookingDto();
    dto.id = entity.id;
    dto.user = this.usersMapper.mapEntityToDto(entity.user);
    dto.schedule = this.schedulesMapper.mapEntityToDto(entity.schedule);
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  mapEntityListToDtoList(entityList: Booking[]): BookingDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Booking): BookingDto => this.mapEntityToDto(x));
  }
}
