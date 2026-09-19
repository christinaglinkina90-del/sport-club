import { PaymentType } from '../enum/payment-type.enum';
import { PaymentStatus } from '../enum/payment-status.enum';

export class PaymentDto {
  id: number;
  userId: number;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  createdAt: Date;
}
