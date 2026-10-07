import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { SchedulesService } from './schedules.service';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesMapper } from './dto/schedules.mapper';
import { SchedulesValidator } from './validation/schedules.validator';
import { ServicesModule } from '../services/services.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [SchedulesController],
  imports: [TypeOrmModule.forFeature([Schedule]), ServicesModule, UsersModule],
  providers: [
    SchedulesService,
    SchedulesRepository,
    SchedulesMapper,
    SchedulesValidator,
  ],
  exports: [SchedulesService, SchedulesMapper],
})
export class SchedulesModule {}
