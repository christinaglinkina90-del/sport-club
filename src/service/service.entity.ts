import { ServiceType } from './enum/service-type.enum';

export class Service {
  id: number;
  name: string;
  type: ServiceType;
  description: string;
  price: number;
  details: Record<string, any>;
  isActive: boolean;
}