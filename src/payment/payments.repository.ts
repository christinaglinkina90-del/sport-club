import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
  ) {}

  async save(payment: Payment): Promise<Payment> {
    return this.repository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.repository.find({
      relations: {
        user: true,
      },
    });
  }

  async findById(id: number): Promise<Payment | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

  }

  async update(id: number, data: Partial<Payment>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
