import { Injectable, Logger } from '@nestjs/common';
import { Payment } from './payment.entity';
import { PaymentsRepository } from './payments.repository';
import { PaymentsMapper } from './dto/payments.mapper';
import { PaymentDto } from './dto/payment.dto';
import { MembershipPaymentSaveDto } from './dto/membership-payment.save-dto';
import { ServicePaymentSaveDto } from './dto/service-payment.save-dto';
import { SingleVisitPaymentSaveDto } from './dto/single-visit-payment.save-dto';
import { PaymentType } from './enums/payment-type.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentsValidator } from './validation/payments.validator';
import { UsersService } from '../users/users.service';
import { MembershipsService } from '../memberships/memberships.service';
import { ServicesService } from '../services/services.service';
import { BookingsService } from '../bookings/bookings.service';
import { User } from '../users/user.entity';
import { Membership } from '../memberships/membership.entity';
import { Service } from '../services/service.entity';
import { Booking } from '../bookings/booking.entity';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

@Injectable()
export class PaymentsService {
  private readonly logger: Logger = new Logger(PaymentsService.name);

  constructor(
    private readonly repository: PaymentsRepository,
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    private readonly servicesService: ServicesService,
    private readonly bookingsService: BookingsService,
    private readonly mapper: PaymentsMapper,
    private readonly validator: PaymentsValidator,
  ) {}

  async createMembershipPayment(
    saveDto: MembershipPaymentSaveDto,
  ): Promise<PaymentDto> {
    this.validator.validateMembershipPaymentSaveDto(saveDto);
    const user: User = await this.usersService.getActiveEntityById(
      saveDto.userId,
    );
    const membership: Membership =
      await this.membershipsService.getActiveEntityById(saveDto.membershipId);

    const entity: Payment = await this.createPayment(
      user,
      Number(membership.price),
      PaymentType.MEMBERSHIP,
    );

    this.logger.log(
      `Payment created: id ${entity.id}, user id ${user.id}, membership id ${membership.id}, amount ${entity.amount}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async createServicePayment(
    saveDto: ServicePaymentSaveDto,
  ): Promise<PaymentDto> {
    this.validator.validateServicePaymentSaveDto(saveDto);
    const user: User = await this.usersService.getActiveEntityById(
      saveDto.userId,
    );
    const service: Service = await this.servicesService.getActiveEntityById(
      saveDto.serviceId,
    );

    const entity: Payment = await this.createPayment(
      user,
      Number(service.price),
      PaymentType.SERVICE,
    );

    this.logger.log(
      `Payment created: id ${entity.id}, user id ${user.id}, service id ${service.id}, amount ${entity.amount}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async createSingleVisitPayment(
    saveDto: SingleVisitPaymentSaveDto,
  ): Promise<PaymentDto> {
    this.validator.validateSingleVisitPaymentSaveDto(saveDto);
    const user: User = await this.usersService.getActiveEntityById(
      saveDto.userId,
    );
    const booking: Booking = await this.bookingsService.getEntityById(
      saveDto.bookingId,
    );

    if (booking.user.id !== user.id) {
      throw new EntityUpdateException(
        `Booking id ${booking.id} does not belong to the user id ${user.id}`,
      );
    }

    const entity: Payment = await this.createPayment(
      user,
      Number(booking.schedule.service.price),
      PaymentType.SINGLE_VISIT,
    );

    this.logger.log(
      `Payment created: id ${entity.id}, user id ${user.id}, booking id ${booking.id}, amount ${entity.amount}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  private async createPayment(
    user: User,
    amount: number,
    type: PaymentType,
  ): Promise<Payment> {
    const entity: Payment = new Payment();
    entity.user = user;
    entity.amount = amount;
    entity.type = type;
    entity.status = PaymentStatus.PENDING;
    return this.repository.save(entity);
  }

  async getAllPayments(): Promise<PaymentDto[]> {
    const payments: Payment[] = await this.repository.findAll();

    if (payments.length === 0) {
      throw new EntityNotFoundException(Payment.name);
    }

    return this.mapper.mapEntityListToDtoList(payments);
  }

  async getPaymentById(id: number): Promise<PaymentDto> {
    const payment: Payment = await this.getEntityById(id);
    return this.mapper.mapEntityToDto(payment);
  }

  private async getEntityById(id: number): Promise<Payment> {
    const payment: Payment | null = await this.repository.findById(id);

    if (!payment) {
      throw new EntityNotFoundException(Payment.name, id);
    }

    return payment;
  }

  async setStatus(id: number, status: PaymentStatus): Promise<void> {
    const payment: Payment = await this.getEntityById(id);

    if (payment.status === status) {
      throw new EntityUpdateException(
        `Payment id ${id} already has status ${status}`,
      );
    }

    payment.status = status;
    await this.repository.save(payment);

    this.logger.log(`Payment updated: id ${id}, new status ${status}`);
  }

  async deleteById(id: number): Promise<void> {
    await this.getEntityById(id);
    await this.repository.deleteById(id);

    this.logger.log(`Payment deleted: id ${id}`);
  }
}
