import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { BookingDto } from './dto/booking.dto';
import { BookingSaveDto } from './dto/booking.save-dto';
import { BookingStatus } from './enums/booking-status.enum';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: BookingDto,
  })
  async create(@Body() saveDto: BookingSaveDto): Promise<BookingDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  @ApiOkResponse({
    type: BookingDto,
    isArray: true,
  })
  async getAll(): Promise<BookingDto[]> {
    return this.service.getAllActiveBookings();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: BookingDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<BookingDto> {
    return this.service.getActiveBookingById(id);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch(':id/set-status/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', new ParseEnumPipe(BookingStatus)) status: BookingStatus,
  ): Promise<void> {
    await this.service.setStatus(id, status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }
}
