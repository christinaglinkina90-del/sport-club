import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserMembershipSaveDto } from '../dto/user-membership.save-dto';

@ValidatorConstraint({
  name: 'isValidDates',
})
export class DatesValidator implements ValidatorConstraintInterface {
  validate(startDate: Date, args: ValidationArguments): boolean {
    const dto: UserMembershipSaveDto = args.object as UserMembershipSaveDto;

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      return false;
    }

    const endDate: Date = dto.endDate;
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      return false;
    }

    if (endDate.getFullYear() - startDate.getFullYear() > 1) {
      return false;
    }

    return endDate.getTime() > startDate.getTime();
  }
}
