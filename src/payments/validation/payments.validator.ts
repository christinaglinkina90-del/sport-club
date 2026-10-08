import { Injectable } from '@nestjs/common';
import { MembershipPaymentSaveDto } from '../dto/membership-payment.save-dto';
import { ServicePaymentSaveDto } from '../dto/service-payment.save-dto';
import { SingleVisitPaymentSaveDto } from '../dto/single-visit-payment.save-dto';

@Injectable()
export class PaymentsValidator {
  validateMembershipPaymentSaveDto(saveDto: MembershipPaymentSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    this.validateId(saveDto.userId);
    this.validateId(saveDto.membershipId);
  }

  validateServicePaymentSaveDto(saveDto: ServicePaymentSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    this.validateId(saveDto.userId);
    this.validateId(saveDto.serviceId);
  }

  validateSingleVisitPaymentSaveDto(saveDto: SingleVisitPaymentSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    this.validateId(saveDto.userId);
    this.validateId(saveDto.bookingId);
  }

  private validateId(id: number): void {
    if (!id || id < 1) {
      throw Error();
    }
  }
}
