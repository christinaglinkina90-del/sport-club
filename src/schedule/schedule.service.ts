import { Injectable } from '@nestjs/common';
import { ScheduleDto } from './dto/schedule.dto.js';
import { ScheduleSaveDto } from './dto/schedule.save-dto.js';
import { ScheduleMapper } from './dto/schedule.mapper.js';
import { Schedule } from './schedule.entity.js';
import { ScheduleUpdateDto } from './dto/schedule.update-dto.js';
import { ScheduleRepository } from './schedule.repository.js';

@Injectable()
export class ScheduleService {
  constructor
  (
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleMapper: ScheduleMapper,
  ) {}

  async create(scheduleSaveDto: ScheduleSaveDto): Promise<ScheduleDto>
  {
    const entity: Schedule = this.scheduleMapper.mapDtoToEntity(scheduleSaveDto);
    const savedEntity = await this.scheduleRepository.save(entity);
    return this.scheduleMapper.mapEntityToDto(savedEntity);}


  async getAllSchedule(): Promise<ScheduleDto[]>
  { const schedule: Schedule[] = await this.scheduleRepository.findAll();
    return this.scheduleMapper.mapEntityListToDtoList(schedule);}



  async getScheduleById(id: number): Promise<ScheduleDto | null> {
    const schedule: Schedule | null = await this.scheduleRepository.findById(id);
    return schedule ? this.scheduleMapper.mapEntityToDto(schedule) : null;}



  async deleteById(id: number): Promise<void> {await this.scheduleRepository.delete(id);}



  async update(id: number, updateDto: ScheduleUpdateDto): Promise<void>
  {
    const foundSchedule: Schedule | null = await this.scheduleRepository.findById(id);

    if (!foundSchedule) {return;}

    Object.assign(foundSchedule, {
      serviceId: updateDto.serviceId ?? foundSchedule.serviceId,
      trainerId: updateDto.trainerId ?? foundSchedule.trainerId,
      date: updateDto.date ?? foundSchedule.date,
      startTime: updateDto.startTime ?? foundSchedule.startTime,
      endTime: updateDto.endTime ?? foundSchedule.endTime,
      capacity: updateDto.capacity ?? foundSchedule.capacity,
    });

    await this.scheduleRepository.save(foundSchedule);
  }
}
