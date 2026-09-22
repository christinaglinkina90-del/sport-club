import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './service/services.module';
import { MembershipsModule } from './membership/memberships.module';
import { UserMembershipsModule } from './user-membership/user-memberships.module';

import { BookingsModule } from './booking/bookings.module';
import { PaymentModule } from './payment/payments.module';
import { NewsModule } from './news/news.module';
import { SchedulesModule } from './schedule/schedules.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as trace_events from 'node:trace_events';

@Module({
  imports: [
    UsersModule,
    ServicesModule,
    MembershipsModule,
    UserMembershipsModule,
    SchedulesModule,
    BookingsModule,
    PaymentModule,
    NewsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        // ssl: {
        //   rejectUnauthorized: true,
        // },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}