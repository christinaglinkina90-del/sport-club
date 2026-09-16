import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { ServicesModule } from './service/services.module.js';
import { MembershipModule } from './membership/memberships.module.js';
import { UserMembershipsModule } from './user-membership/user-memberships.module.js';
import { ScheduleModule } from './schedule/sсhedules.module.js';
import { BookingsModule } from './booking/bookings.module.js';
import { PaymentModule } from './payment/payments.module.js';
import { NewsModule } from './news/news.module.js';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty123',
      database: 'sport-club',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
