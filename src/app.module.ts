import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { MembershipsModule } from './memberships/memberships.module';
import { UserMembershipsModule } from './user-memberships/user-memberships.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { NewsModule } from './news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { EmbeddingsModule } from './embeddings/embeddings.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { ConfirmationCodesModule } from './confirmation-codes/confirmation-codes.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UsersModule,
    ServicesModule,
    MembershipsModule,
    UserMembershipsModule,
    SchedulesModule,
    BookingsModule,
    PaymentsModule,
    NewsModule,
    AuthModule,
    ConfirmationCodesModule,
    EmailModule,
    AiModule,
    EmbeddingsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const enableSsl: boolean =
          configService.get<string>('DB_SSL') === 'true';
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('DB_HOST'),
          port: Number(configService.getOrThrow<string>('DB_PORT')),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: enableSsl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
