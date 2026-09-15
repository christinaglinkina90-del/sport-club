import { User } from '../users/user.entity.js';
import { PaymentType } from './enum/payment-type.enum.js';
import { PaymentStatus } from './enum/payment-status.enum.js';

export class Payment {
  id: number;
  user: User;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
}
