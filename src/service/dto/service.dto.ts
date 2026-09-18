import { ServiceType } from '../enum/service-type.enum';

export class ServiceDto {
  id: number;
  name: string;
  description: string;
  price: number;
  type: ServiceType;
}