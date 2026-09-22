import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  trainerId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  capacity: number;
}
