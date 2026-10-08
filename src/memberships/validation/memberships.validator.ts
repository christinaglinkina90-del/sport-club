import { Injectable } from '@nestjs/common';
import { MembershipSaveDto } from '../dto/membership.save-dto';
import { MembershipUpdateDto } from '../dto/membership.update-dto';
import { MembershipType } from '../enums/membership-type.enum';

@Injectable()
export class MembershipsValidator {
  validateSaveDto(saveDto: MembershipSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const name: string = saveDto.name.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }

    const type: MembershipType = saveDto.type;
    if (!type) {
      throw Error();
    }

    const description: string = saveDto.description.trim();
    if (!description || description.length < 2 || description.length > 200) {
      throw Error();
    }

    const price: number = saveDto.price;
    if (price === undefined || price === null || price < 0) {
      throw Error();
    }

    const durationInDays: number = saveDto.durationInDays;
    if (!durationInDays || durationInDays < 1 || durationInDays > 366) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: MembershipUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    const name: string = updateDto.newName.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }
  }
}
