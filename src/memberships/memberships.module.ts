import { Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsMapper } from './dto/memberships.mapper';
import { MembershipsValidator } from './validation/memberships.validator';

@Module({
  controllers: [MembershipsController],
  imports: [TypeOrmModule.forFeature([Membership])],
  providers: [
    MembershipsService,
    MembershipsRepository,
    MembershipsMapper,
    MembershipsValidator,
  ],
  exports: [MembershipsService, MembershipsMapper],
})
export class MembershipsModule {}
