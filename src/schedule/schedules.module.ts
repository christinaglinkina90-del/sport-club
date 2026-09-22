import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesMapper } from './dto/schedules.mapper';
import { ServicesModule } from '../service/services.module';
import { UsersModule } from '../users/users.module';
import { SchedulesValidator } from './schedulesValidator/schedulesValidator';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), ServicesModule, UsersModule],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository, SchedulesMapper, SchedulesValidator],
  exports: [SchedulesService, SchedulesMapper],
})
export class SchedulesModule {}
