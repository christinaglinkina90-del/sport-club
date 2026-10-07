import { ServiceType } from '../enums/service-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Length, Matches, Min } from 'class-validator';

export class ServiceSaveDto {
  @ApiProperty()
  @Length(2, 30)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Name should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  name: string;

  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty()
  @Length(2, 200)
  description: string;

  @ApiProperty()
  @Min(0)
  price: number;
}
