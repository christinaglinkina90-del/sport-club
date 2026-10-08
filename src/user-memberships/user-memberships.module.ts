import { Module } from '@nestjs/common';
import { UserMembershipsController } from './user-memberships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMembership } from './user-membership.entity';
import { UserMembershipsService } from './user-memberships.service';
import { UserMembershipsRepository } from './user-memberships.repository';
import { UserMembershipsMapper } from './dto/user-memberships.mapper';
import { UserMembershipsValidator } from './validation/user-memberships.validator';
import { UsersModule } from '../users/users.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  controllers: [UserMembershipsController],
  imports: [
    TypeOrmModule.forFeature([UserMembership]),
    UsersModule,
    MembershipsModule,
    PaymentsModule,
  ],
  providers: [
    UserMembershipsService,
    UserMembershipsRepository,
    UserMembershipsMapper,
    UserMembershipsValidator,
  ],
  exports: [UserMembershipsService, UserMembershipsMapper],
})
export class UserMembershipsModule {}
