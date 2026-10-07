import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';
import { MembershipPaymentSaveDto } from './dto/membership-payment.save-dto';
import { ServicePaymentSaveDto } from './dto/service-payment.save-dto';
import { SingleVisitPaymentSaveDto } from './dto/single-visit-payment.save-dto';
import { PaymentStatus } from './enums/payment-status.enum';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Roles(Role.ADMIN)
  @Post('membership')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: PaymentDto,
  })
  async createMembershipPayment(
    @Body() saveDto: MembershipPaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createMembershipPayment(saveDto);
  }

  @Roles(Role.ADMIN)
  @Post('service')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: PaymentDto,
  })
  async createServicePayment(
    @Body() saveDto: ServicePaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createServicePayment(saveDto);
  }

  @Roles(Role.ADMIN)
  @Post('single-visit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: PaymentDto,
  })
  async createSingleVisitPayment(
    @Body() saveDto: SingleVisitPaymentSaveDto,
  ): Promise<PaymentDto> {
    return this.service.createSingleVisitPayment(saveDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOkResponse({
    type: PaymentDto,
    isArray: true,
  })
  async getAll(): Promise<PaymentDto[]> {
    return this.service.getAllPayments();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOkResponse({
    type: PaymentDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<PaymentDto> {
    return this.service.getPaymentById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/set-status/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', new ParseEnumPipe(PaymentStatus)) status: PaymentStatus,
  ): Promise<void> {
    await this.service.setStatus(id, status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }
}
