import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches, Max, Min, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleDateValidator } from '../validation/schedule-date.validator';

export class ScheduleUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Validate(ScheduleDateValidator, {
    message: 'Schedule date should not be earlier than today',
  })
  @Type((): DateConstructor => Date)
  newDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'Start time should be in HH:MM format',
  })
  newStartTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'End time should be in HH:MM format',
  })
  newEndTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(1)
  @Max(100)
  newCapacity?: number;
}
