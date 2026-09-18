import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ServicesRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {}

  async save(service: Service): Promise<Service> {
    return this.repository.save(service);
  }
  async findAllActive(): Promise<Service[]> {
    return this.repository.findBy({ isActive: true });
}
  async findById(id: number): Promise<Service | null> {
    return this.repository.findOneBy({ id });
}
  async update(id: number, data: Partial<Service>): Promise<void> {
    await this.repository.update(id, data);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

}
