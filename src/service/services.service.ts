import { Injectable, Logger } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { ServicesMapper } from './dto/service.mapper';
import { ServiceDto } from './dto/service.dto';
import { Service } from './service.entity';
import { ServiceSaveDto } from './dto/service.save-dto';
import { ServiceUpdateDto } from './dto/service.update-dto';




@Injectable()
export class ServicesService {
  private readonly logger: Logger = new Logger(ServicesService.name);

  constructor(
    private readonly repository: ServicesRepository,
    private readonly mapper: ServicesMapper,
  ) {}

  async create(saveDto: ServiceSaveDto): Promise<ServiceDto> {
    const entity: Service = this.mapper.mapDtoToEntity(saveDto);
    entity.isActive = true;
    await this.repository.save(entity);

    this.logger.log(`Service created: id ${entity.id}, name ${entity.name}`);

    return this.mapper.mapEntityToDto(entity);
  }
  async getAllActiveServices(): Promise<ServiceDto[]> {
    const service: Service[] = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(service);
  }

  async getActiveServiceById(id: number): Promise<ServiceDto> {
    const service: Service = await this.getActiveEntityById(id);

    return this.mapper.mapEntityToDto(service);
  }

  async getActiveEntityById(id: number): Promise<Service> {
    const service: Service | null = await this.repository.findById(id);
    if (!service || !service.isActive) {
      throw new Error(`Service with id ${id} not found`);
    }
    return service;
  }
  async update(id: number, updateDto: ServiceUpdateDto): Promise<void> {
    const service = await this.getActiveEntityById(id);
    service.name = updateDto.newName;
    await this.repository.save(service);

    this.logger.log(`Service updated: id ${id}, new name: ${service.name}`);
  }
  async delete(id: number): Promise<void> {
    const service = await this.getActiveEntityById(id);
    service.isActive = false;
    await this.repository.save(service);

    this.logger.log(`Service marked as inactive: id ${id}`);
  }
}