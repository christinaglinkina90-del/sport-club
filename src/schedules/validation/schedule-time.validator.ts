import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ScheduleSaveDto } from '../dto/schedule.save-dto';

@ValidatorConstraint({
  name: 'isValidScheduleTime',
})
export class ScheduleTimeValidator implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments): boolean {
    const dto: ScheduleSaveDto = args.object as ScheduleSaveDto;

    if (!dto.startTime || !endTime) {
      return false;
    }

    return endTime > dto.startTime;
  }
}
