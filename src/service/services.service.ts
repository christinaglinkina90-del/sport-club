import { Injectable } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { ServicesMapper } from './dto/service.mapper';
import { ServiceDto } from './dto/service.dto';
import { Service } from './service.entity';
import { ServiceSaveDto } from './dto/service.save-dto';



@Injectable()
export class ServicesService {
  constructor(
    private readonly repository: ServicesRepository,
    private readonly mapper: ServicesMapper,
  ) {}

  async create(saveDto: ServiceSaveDto): Promise<ServiceDto> {
    const entity: Service = this.mapper.mapDtoToEntity(saveDto);
    entity.isActive = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }
  async getActiveServicesById(id: number): Promise<ServiceDto> {
    const service: Service = await this.getActiveEntityById(id);

    return this.mapper.mapEntityToDto(service);
  }
  private async getActiveEntityById(id: number): Promise<Service> {
    const service: Service | null = await this.repository.findById(id);
    if (!service || !service.isActive) {
      throw new Error(`Service with id ${id} not found`);
    }
    return service;
  }
}