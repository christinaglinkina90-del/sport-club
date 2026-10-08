import { HttpException, HttpStatus } from '@nestjs/common';

export class BookingException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
