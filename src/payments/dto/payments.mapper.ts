import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { PaymentDto } from './payment.dto';
import { UsersMapper } from '../../users/dto/users.mapper';

@Injectable()
export class PaymentsMapper {
  constructor(private readonly usersMapper: UsersMapper) {}

  mapEntityToDto(entity: Payment): PaymentDto {
    const dto: PaymentDto = new PaymentDto();
    dto.id = entity.id;
    dto.user = this.usersMapper.mapEntityToDto(entity.user);
    dto.amount = entity.amountInCents / 100;
    dto.type = entity.type;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  mapEntityListToDtoList(entityList: Payment[]): PaymentDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Payment): PaymentDto => this.mapEntityToDto(x));
  }
}
