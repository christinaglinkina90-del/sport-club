import { ApiProperty } from '@nestjs/swagger';
import { ServiceDto } from '../../services/dto/service.dto';
import { UserDto } from '../../users/dto/user.dto';

export class ScheduleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  service: ServiceDto;

  @ApiProperty()
  trainer: UserDto;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  capacity: number;
}
