import { Injectable, Logger } from '@nestjs/common';
import { Service } from './service.entity';
import { ServicesRepository } from './services.repository';
import { ServicesMapper } from './dto/services.mapper';
import { ServiceSaveDto } from './dto/service.save-dto';
import { ServiceDto } from './dto/service.dto';
import { ServiceUpdateDto } from './dto/service.update-dto';
import { ServicesValidator } from './validation/services.validator';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';

@Injectable()
export class ServicesService {
  private readonly logger: Logger = new Logger(ServicesService.name);

  constructor(
    private readonly repository: ServicesRepository,
    private readonly mapper: ServicesMapper,
    private readonly validator: ServicesValidator,
  ) {}

  async create(saveDto: ServiceSaveDto): Promise<ServiceDto> {
    if (await this.repository.isNameExists(saveDto.name)) {
      throw new EntitySaveException(Service.name, 'name');
    }

    this.validator.validateSaveDto(saveDto);
    const entity: Service = this.mapper.mapDtoToEntity(saveDto);
    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(`Service created: id ${entity.id}, name ${entity.name}`);

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveServices(): Promise<ServiceDto[]> {
    const services: Service[] = await this.repository.findAllActive();

    if (services.length === 0) {
      throw new EntityNotFoundException(Service.name);
    }

    return this.mapper.mapEntityListToDtoList(services);
  }

  async getActiveServiceById(id: number): Promise<ServiceDto> {
    const service: Service = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(service);
  }

  async getActiveEntityById(id: number): Promise<Service> {
    const service: Service | null = await this.repository.findById(id);

    if (!service || !service.active) {
      throw new EntityNotFoundException(Service.name, id);
    }

    return service;
  }

  async update(id: number, updateDto: ServiceUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundService: Service = await this.getActiveEntityById(id);

    if (foundService) {
      foundService.name = updateDto.newName;
      await this.repository.save(foundService);

      this.logger.log(
        `Service updated: id ${id}, new name ${foundService.name}`,
      );
    } else {
      throw new EntityNotFoundException(Service.name, id);
    }
  }

  async deleteById(id: number): Promise<void> {
    const service: Service = await this.getActiveEntityById(id);
    service.active = false;
    await this.repository.save(service);

    this.logger.log(`Service marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const service: Service | null = await this.repository.findById(id);

    if (!service) {
      throw new EntityNotFoundException(Service.name, id);
    }

    if (!service.active) {
      service.active = true;
      await this.repository.save(service);

      this.logger.log(`Service marked as active: id ${id}`);
    }
  }
}
