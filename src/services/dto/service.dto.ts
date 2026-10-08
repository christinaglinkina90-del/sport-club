import { ServiceType } from '../enums/service-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ServiceType })
  type: ServiceType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;
}
