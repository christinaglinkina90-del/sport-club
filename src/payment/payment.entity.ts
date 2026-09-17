import { User } from '../users/user.entity';
import { PaymentType } from './enum/payment-type.enum';
import { PaymentStatus } from './enum/payment-status.enum';

export class Payment {
  id: number;
  user: User;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
}
