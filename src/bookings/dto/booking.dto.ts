import { BookingStatus } from '../enums/booking-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { ScheduleDto } from '../../schedules/dto/schedule.dto';

export class BookingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  schedule: ScheduleDto;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;
}
