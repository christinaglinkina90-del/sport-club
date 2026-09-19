import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './service/services.module';
import { MembershipModule } from './membership/memberships.module';
import { UserMembershipsModule } from './user-membership/user-memberships.module';
import { BookingsModule } from './booking/bookings.module';
import { PaymentModule } from './payment/payments.module';
import { NewsModule } from './news/news.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    UsersModule,
    ServicesModule,
    MembershipModule,
    UserMembershipsModule,
    ScheduleModule,
    BookingsModule,
    PaymentModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}