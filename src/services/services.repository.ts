import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

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
    return this.repository.findBy({ active: true });
  }

  async findById(id: number): Promise<Service | null> {
    return this.repository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async isNameExists(name: string): Promise<boolean> {
    return this.repository.existsBy({ name });
  }
}
