import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { ServicesMapper } from './dto/services.mapper';
import { ServicesValidator } from './validation/services.validator';

@Module({
  controllers: [ServicesController],
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [
    ServicesService,
    ServicesRepository,
    ServicesMapper,
    ServicesValidator,
  ],
  exports: [ServicesService, ServicesMapper],
})
export class ServicesModule {}
