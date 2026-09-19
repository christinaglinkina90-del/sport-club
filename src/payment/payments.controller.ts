import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { MembershipPaymentSaveDto } from './dto/membership-payment.save-dto';
import { ServicePaymentSaveDto } from './dto/service-payment.save-dto';
import { SingleVisitPaymentSaveDto } from './dto/single-visit-payment.save-dto';
import { PaymentUpdateDto } from './dto/payment.update-dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('membership')
  async createMembershipPayment(
    @Body() dto: MembershipPaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createMembershipPayment(dto);
  }

  @Post('service')
  async createServicePayment(
    @Body() dto: ServicePaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createServicePayment(dto);
  }

  @Post('single-visit')
  async createSingleVisitPayment(
    @Body() dto: SingleVisitPaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createSingleVisitPayment(dto);
  }

  @Get()
  async getAll(): Promise<PaymentDto[]> {
    return this.service.getAllPayments();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<PaymentDto> {
    return this.service.getPaymentById(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: PaymentUpdateDto,
  ): Promise<void> {
    await this.service.updateStatus(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
