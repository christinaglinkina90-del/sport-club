import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { PaymentDto } from './payment.dto';

@Injectable()
export class PaymentsMapper {
  mapEntityToDto(entity: Payment): PaymentDto {
    const dto = new PaymentDto();
    dto.id = entity.id;
    dto.userId = entity.user.id;
    dto.amount = entity.amount;
    dto.type = entity.type;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  mapEntityListToDtoList(entityList: Payment[]): PaymentDto[] {
    if (!entityList) return [];
    return entityList.map((p) => this.mapEntityToDto(p));
  }
}
