import { Module } from '@nestjs/common';
import { MembershipsModule } from '../membership/memberships.module';
import { UsersModule } from '../users/users.module';
import { UserMembershipMapper } from './dto/user-membership.mapper';
import { UserMembershipsController } from './user-memberships.controller';
import { UserMembershipsService } from './user-memberships.service';
import { UserMembershipsRepository } from './user-memberships.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMembership } from './user-membership.entity';

@Module({
  controllers: [UserMembershipsController],
  providers: [
    UserMembershipMapper,
    UserMembershipsService,
    UserMembershipsRepository,
  ],
  imports: [
    MembershipsModule,
    UsersModule,
    TypeOrmModule.forFeature([UserMembership]),
  ],
  exports: [],
})
export class UserMembershipsModule {}
