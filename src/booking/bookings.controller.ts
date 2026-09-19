import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/booking.dto';
import { BookingSaveDto } from './dto/booking.save-dto';
import { BookingUpdateDto } from './dto/booking.update-dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  async create(@Body() dto: BookingSaveDto): Promise<BookingDto> {
    return this.service.create(dto);
  }

  @Get()
  async getAll(): Promise<BookingDto[]> {
    return this.service.getAllBookings();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<BookingDto> {
    return this.service.getBookingById(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BookingUpdateDto,
  ): Promise<void> {
    await this.service.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
