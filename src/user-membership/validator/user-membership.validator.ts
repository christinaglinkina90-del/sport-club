import { UserMembershipSaveDto } from '../dto/user-membership.save-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMembershipValidator {
  validateSaveDto(dto: UserMembershipSaveDto): void {
    if (!dto) {
      throw new Error('DTO is empty');
    }

    // endDate должен быть после startDate
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw Error('End date must be after start date');
    }
  }
}
