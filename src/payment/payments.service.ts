import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { PaymentsMapper } from './dto/payments.mapper';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { MembershipPaymentSaveDto } from './dto/membership-payment.save-dto';
import { ServicePaymentSaveDto } from './dto/service-payment.save-dto';
import { SingleVisitPaymentSaveDto } from './dto/single-visit-payment.save-dto';
import { PaymentUpdateDto } from './dto/payment.update-dto';
import { PaymentType } from './enum/payment-type.enum';
import { PaymentStatus } from './enum/payment-status.enum';
import { UsersService } from '../users/users.service';
import { MembershipsService } from '../membership/memberships.service';
import { ServicesService } from '../service/services.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly repository: PaymentsRepository,
    private readonly mapper: PaymentsMapper,
    private readonly usersService: UsersService,
    private readonly membershipsService: MembershipsService,
    private readonly servicesService: ServicesService,
  ) {}

  async createMembershipPayment(
    dto: MembershipPaymentSaveDto,
  ): Promise<PaymentDto> {
    const user = await this.usersService.getActiveEntityById(dto.userId); //1. Находим пользователя

    const membership = await this.membershipsService.getActiveEntityById(
      dto.membershipId); // 2. Находим абонемент

    const payment = new Payment(); // 3. Создаём платёж
    payment.user = user;
    payment.amount = membership.price; // ← цена из БазыД
    payment.type = PaymentType.MEMBERSHIP;
    payment.status = PaymentStatus.PENDING;

    // 4. Сохраняем
    await this.repository.save(payment);

    // 5. Возвращаем DTO
    return this.mapper.mapEntityToDto(payment);
  }
  async createServicePayment(dto: ServicePaymentSaveDto): Promise<PaymentDto> {
    const user = await this.usersService.getActiveEntityById(dto.userId);
    const service = await this.servicesService.getActiveEntityById(
      dto.serviceId,
    );

    const payment = new Payment();
    payment.user = user;
    payment.amount = service.price;
    payment.type = PaymentType.SERVICE;
    payment.status = PaymentStatus.PENDING;

    await this.repository.save(payment);
    return this.mapper.mapEntityToDto(payment);
  }
  async createSingleVisitPayment(
    dto: SingleVisitPaymentSaveDto,
  ): Promise<PaymentDto> {
    const user = await this.usersService.getActiveEntityById(dto.userId);

    const payment = new Payment();
    payment.user = user;
    payment.amount = 0; // ← временно, пока нет BookingsService
    payment.type = PaymentType.SINGLE_VISIT;
    payment.status = PaymentStatus.PENDING;

    await this.repository.save(payment);
    return this.mapper.mapEntityToDto(payment);
  }
  async getAllPayments(): Promise<PaymentDto[]> {
    const payments = await this.repository.findAll();
    return this.mapper.mapEntityListToDtoList(payments);
  }
  async getPaymentById(id: number): Promise<PaymentDto> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return this.mapper.mapEntityToDto(payment);
  }
  async updateStatus(id: number, updateDto: PaymentUpdateDto): Promise<void> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    if (updateDto.status) {
      payment.status = updateDto.status;
      await this.repository.save(payment);
    }
  }
  async delete(id: number): Promise<void> {
    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    await this.repository.delete(id);
  }
}