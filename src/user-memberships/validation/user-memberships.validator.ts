import { Injectable } from '@nestjs/common';
import { UserMembershipSaveDto } from '../dto/user-membership.save-dto';
import { MembershipStatus } from '../enums/membership-status.enum';

@Injectable()
export class UserMembershipsValidator {
  validateSaveDto(saveDto: UserMembershipSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const userId: number = saveDto.userId;
    if (!userId || userId < 1) {
      throw Error();
    }

    const membershipId: number = saveDto.membershipId;
    if (!membershipId || membershipId < 1) {
      throw Error();
    }

    const status: MembershipStatus = saveDto.status;
    if (!status) {
      throw Error();
    }

    const startDate: Date = saveDto.startDate;
    const endDate: Date = saveDto.endDate;
    if (
      !startDate ||
      !endDate ||
      endDate.getFullYear() - startDate.getFullYear() > 1 ||
      endDate.getTime() <= startDate.getTime()
    ) {
      throw Error();
    }
  }
}
