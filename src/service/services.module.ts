import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesMapper } from './dto/service.mapper';
import { ServicesController } from './service.controller';
import { ServicesRepository } from './services.repository';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesMapper,ServicesService,ServicesRepository],
  exports: [ServicesMapper],
})
export class ServicesModule {}