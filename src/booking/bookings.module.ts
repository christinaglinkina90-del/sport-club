import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsRepository } from './bookings.repository';
import { BookingsMapper } from './dto/bookings.mapper';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '../schedule/schedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule, ScheduleModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository, BookingsMapper],
  exports: [BookingsService, BookingsMapper],
})
export class BookingsModule {}
