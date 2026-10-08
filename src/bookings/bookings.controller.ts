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
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { BookingDto } from './dto/booking.dto';
import { BookingSaveDto } from './dto/booking.save-dto';
import { MyBookingSaveDto } from './dto/my-booking.save-dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { BookingStatus } from './enums/booking-status.enum';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  // Маршруты /bookings/my объявлены раньше /bookings/:id,
  // иначе "my" попадёт в параметр :id и ParseIntPipe вернёт 400.
  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Post('my')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: BookingDto,
  })
  async createMy(
    @Body() saveDto: MyBookingSaveDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<BookingDto> {
    return this.service.createForCurrentUser(request.user, saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get('my')
  @ApiOkResponse({
    type: BookingDto,
    isArray: true,
  })
  async getMy(@Req() request: AuthenticatedRequest): Promise<BookingDto[]> {
    return this.service.getActiveBookingsOfUser(request.user);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Patch('my/:id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelMy(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.service.cancelByCurrentUser(request.user, id);
  }

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
