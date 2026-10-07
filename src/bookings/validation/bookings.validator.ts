import { Injectable } from '@nestjs/common';
import { BookingSaveDto } from '../dto/booking.save-dto';

@Injectable()
export class BookingsValidator {
  validateSaveDto(saveDto: BookingSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const userId: number = saveDto.userId;
    if (!userId || userId < 1) {
      throw Error();
    }

    const scheduleId: number = saveDto.scheduleId;
    if (!scheduleId || scheduleId < 1) {
      throw Error();
    }
  }
}
