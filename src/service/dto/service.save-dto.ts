import { ServiceType } from '../enum/service-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class ServiceSaveDto {
  @ApiProperty()
  @Length(2, 20)
  @Matches(/^[A]/)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 200)
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  type: ServiceType;
}
