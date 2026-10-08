import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { PaymentsMapper } from './dto/payments.mapper';
import { PaymentsValidator } from './validation/payments.validator';
import { UsersModule } from '../users/users.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { ServicesModule } from '../services/services.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  controllers: [PaymentsController],
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    MembershipsModule,
    ServicesModule,
    BookingsModule,
  ],
  providers: [
    PaymentsService,
    PaymentsRepository,
    PaymentsMapper,
    PaymentsValidator,
  ],
  exports: [PaymentsService, PaymentsMapper],
})
export class PaymentsModule {}
