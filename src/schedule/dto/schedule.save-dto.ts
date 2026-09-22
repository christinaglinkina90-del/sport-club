import { IsDateString, IsInt, IsString, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleSaveDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  trainerId: number;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  capacity: number;
}