import { Injectable, Logger } from '@nestjs/common';
import { Membership } from './membership.entity';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsMapper } from './dto/memberships.mapper';
import { MembershipSaveDto } from './dto/membership.save-dto';
import { MembershipDto } from './dto/membership.dto';
import { MembershipUpdateDto } from './dto/membership.update-dto';
import { MembershipsValidator } from './validation/memberships.validator';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';

@Injectable()
export class MembershipsService {
  private readonly logger: Logger = new Logger(MembershipsService.name);

  constructor(
    private readonly repository: MembershipsRepository,
    private readonly mapper: MembershipsMapper,
    private readonly validator: MembershipsValidator,
  ) {}

  async create(saveDto: MembershipSaveDto): Promise<MembershipDto> {
    if (await this.repository.isNameAndTypeExists(saveDto.name, saveDto.type)) {
      throw new EntitySaveException(Membership.name, 'name and type');
    }

    this.validator.validateSaveDto(saveDto);
    const entity: Membership = this.mapper.mapDtoToEntity(saveDto);
    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(
      `Membership created: id ${entity.id}, name ${entity.name}, type ${entity.type}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveMemberships(): Promise<MembershipDto[]> {
    const memberships: Membership[] = await this.repository.findAllActive();

    if (memberships.length === 0) {
      throw new EntityNotFoundException(Membership.name);
    }

    return this.mapper.mapEntityListToDtoList(memberships);
  }

  async getActiveMembershipById(id: number): Promise<MembershipDto> {
    const membership: Membership = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(membership);
  }

  async getActiveEntityById(id: number): Promise<Membership> {
    const membership: Membership | null = await this.repository.findById(id);

    if (!membership || !membership.active) {
      throw new EntityNotFoundException(Membership.name, id);
    }

    return membership;
  }

  async update(id: number, updateDto: MembershipUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundMembership: Membership = await this.getActiveEntityById(id);

    if (foundMembership) {
      foundMembership.name = updateDto.newName;
      await this.repository.save(foundMembership);

      this.logger.log(
        `Membership updated: id ${id}, new name ${foundMembership.name}`,
      );
    } else {
      throw new EntityNotFoundException(Membership.name, id);
    }
  }

  async deleteById(id: number): Promise<void> {
    const membership: Membership = await this.getActiveEntityById(id);
    membership.active = false;
    await this.repository.save(membership);

    this.logger.log(`Membership marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const membership: Membership | null = await this.repository.findById(id);

    if (!membership) {
      throw new EntityNotFoundException(Membership.name, id);
    }

    if (!membership.active) {
      membership.active = true;
      await this.repository.save(membership);

      this.logger.log(`Membership marked as active: id ${id}`);
    }
  }
}
