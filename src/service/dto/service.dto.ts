import { ServiceType } from '../enum/service-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  type: ServiceType;
}