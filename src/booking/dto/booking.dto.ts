import { BookingStatus } from '../enum/booking-status.enum';


export class BookingDto {
  id: number;
  userId: number;
  scheduleId: number;
  status: BookingStatus;
  createdAt: Date;
}
