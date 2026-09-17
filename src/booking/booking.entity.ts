import { Schedule } from '../schedule/schedule.entity';
import { User } from '../users/user.entity';
import { BookingStatus } from './enum/booking-status.enum';

export class Booking {
  id: number;
  user: User;
  schedule:Schedule;
  status: BookingStatus;
  createdAt: Date;
}
