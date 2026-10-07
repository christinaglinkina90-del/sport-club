import { ApiProperty } from '@nestjs/swagger';
import { Matches, Max, Min, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleDateValidator } from '../validation/schedule-date.validator';
import { ScheduleTimeValidator } from '../validation/schedule-time.validator';

export class ScheduleSaveDto {
  @ApiProperty()
  @Min(1)
  serviceId: number;

  @ApiProperty()
  @Min(1)
  trainerId: number;

  @ApiProperty()
  @Validate(ScheduleDateValidator, {
    message: 'Schedule date should not be earlier than today',
  })
  @Type((): DateConstructor => Date)
  date: Date;

  @ApiProperty()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'Start time should be in HH:MM format',
  })
  startTime: string;

  @ApiProperty()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'End time should be in HH:MM format',
  })
  @Validate(ScheduleTimeValidator, {
    message: 'End time should be later than start time',
  })
  endTime: string;

  @ApiProperty()
  @Min(1)
  @Max(100)
  capacity: number;
}
