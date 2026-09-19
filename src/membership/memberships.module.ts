import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsMapper } from './dto/memberships.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsRepository, MembershipsMapper],
  exports: [MembershipsService, MembershipsMapper],
})
export class MembershipsModule {}
