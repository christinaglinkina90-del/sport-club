import { Service } from '../service/service.entity';
import { User } from '../users/user.entity';


export class Schedule {
  id: number;
  service: Service ;
  trainer: User;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
}
