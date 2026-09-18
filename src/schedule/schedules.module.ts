import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controllers.js';
import { Schedule } from './schedule.entity.js';
import { ScheduleMapper } from './dto/schedule.mapper.js';
import { ScheduleRepository } from './schedule.repository.js';
import { ScheduleService } from './schedule.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository, ScheduleMapper],
  exports: [ScheduleService],
})
export class ScheduleModule {}
