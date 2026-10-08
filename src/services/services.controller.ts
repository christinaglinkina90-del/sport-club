import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { ServiceDto } from './dto/service.dto';
import { ServiceSaveDto } from './dto/service.save-dto';
import { ServiceUpdateDto } from './dto/service.update-dto';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: ServiceDto,
  })
  async create(@Body() saveDto: ServiceSaveDto): Promise<ServiceDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get()
  @ApiOkResponse({
    type: ServiceDto,
    isArray: true,
  })
  async getAll(): Promise<ServiceDto[]> {
    return this.service.getAllActiveServices();
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get(':id')
  @ApiOkResponse({
    type: ServiceDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ServiceDto> {
    return this.service.getActiveServiceById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: ServiceUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }
}
