import { Service } from '../service/service.entity.js';
import { User } from '../users/user.entity.js';


export class Schedule {
  id: number;
  service: Service ;
  trainer: User;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
}
