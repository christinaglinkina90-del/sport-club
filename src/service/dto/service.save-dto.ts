import { ServiceType } from '../enum/service-type.enum';

export class ServiceSaveDto {
  name: string;
  description: string;
  price: number;
  type: ServiceType;
}
