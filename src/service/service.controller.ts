import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceDto } from './dto/service.dto';
import { ServiceSaveDto } from './dto/service.save-dto';


@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Post()
  async create(@Body() saveDto: ServiceSaveDto): Promise<ServiceDto> {
    return this.service.create(saveDto);
  }
