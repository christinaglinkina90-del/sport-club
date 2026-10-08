import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'isValidScheduleDate',
})
export class ScheduleDateValidator implements ValidatorConstraintInterface {
  validate(date: Date): boolean {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return false;
    }

    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    return date.getTime() >= today.getTime();
  }
}
