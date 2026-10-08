import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class MyBookingSaveDto {
  @ApiProperty()
  @Min(1)
  scheduleId: number;
}
