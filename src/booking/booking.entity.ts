import { User } from '../users/user.entity.js';
import { Schedule } from '../schedule/schedule.entity.js';
import { BookingStatus } from './enum/booking-status.enum.js';

export class Booking {
  id: number;
  user: User;
  schedule:Schedule;
  status: BookingStatus;
  createdAt: Date;
}
