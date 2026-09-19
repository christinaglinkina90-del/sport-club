import { Injectable } from '@nestjs/common';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsMapper } from './dto/memberships.mapper';
import { Membership } from './membership.entity';
import { MembershipDto } from './dto/membership.dto';
import { MembershipSaveDto } from './dto/membership.save-dto';
import { MembershipUpdateDto } from './dto/membership.update-dto';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly repository: MembershipsRepository,
    private readonly mapper: MembershipsMapper,
  ) {}

  async create(saveDto: MembershipSaveDto): Promise<MembershipDto> {
    const entity = this.mapper.mapDtoToEntity(saveDto);
    entity.isActive = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveMemberships(): Promise<MembershipDto[]> {
    const memberships = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(memberships);
  }

  async getActiveMembershipById(id: number): Promise<MembershipDto> {
    const membership = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(membership);
  }

  async getActiveEntityById(id: number): Promise<Membership> {
    const membership = await this.repository.findById(id);
    if (!membership || !membership.isActive) {
      throw new Error(`Membership with id ${id} not found`);
    }
    return membership;
  }

  async update(id: number, updateDto: MembershipUpdateDto): Promise<void> {
    const membership = await this.getActiveEntityById(id);
    membership.name = updateDto.newName;
    await this.repository.save(membership);
  }

  async delete(id: number): Promise<void> {
    const membership = await this.getActiveEntityById(id);
    membership.isActive = false;
    await this.repository.save(membership);
  }
}
