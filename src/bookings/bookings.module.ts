import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { BookingsValidator } from './validation/bookings.validator';
import { UsersModule } from '../users/users.module';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  controllers: [BookingsController],
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, SchedulesModule],
  providers: [
    BookingsService,
    BookingsRepository,
    BookingsMapper,
    BookingsValidator,
  ],
  exports: [BookingsService, BookingsMapper],
})
export class BookingsModule {}
