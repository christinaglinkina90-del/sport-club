import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { PaymentsMapper } from './dto/payments.mapper';
import { UsersModule } from '../users/users.module';
import { MembershipsModule } from '../membership/memberships.module';
import { ServicesModule } from '../service/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    MembershipsModule,
    ServicesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, PaymentsMapper],
  exports: [PaymentsService, PaymentsMapper],
})
export class PaymentModule {}
