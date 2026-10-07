import { Injectable } from '@nestjs/common';
import { ServiceSaveDto } from '../dto/service.save-dto';
import { ServiceUpdateDto } from '../dto/service.update-dto';
import { ServiceType } from '../enums/service-type.enum';

@Injectable()
export class ServicesValidator {
  validateSaveDto(saveDto: ServiceSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const name: string = saveDto.name.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }

    const type: ServiceType = saveDto.type;
    if (!type) {
      throw Error();
    }

    const description: string = saveDto.description.trim();
    if (!description || description.length < 2 || description.length > 200) {
      throw Error();
    }

    const price: number = saveDto.price;
    if (price === undefined || price === null || price < 0) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: ServiceUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    const name: string = updateDto.newName.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }
  }
}
