import { BookingStatus } from '../enum/booking-status.enum';
import { ApiProperty } from '@nestjs/swagger';


export class BookingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  scheduleId: number;

  @ApiProperty()
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;
}
