import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { IngestDocumentDto } from './dto/ingest-document.dto';
import { IngestResultDto } from './dto/ingest-result.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly service: IngestionService) {}

  @Roles(Role.ADMIN)
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        serviceType: { type: 'string', example: 'general' },
        language: { type: 'string', example: 'ru' },
        publicAccess: { type: 'boolean', example: true },
        documentVersion: { type: 'integer', example: 1 },
        documentId: { type: 'string', example: 'club-rules' },
      },
    },
  })
  @ApiOkResponse({
    type: IngestResultDto,
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() ingestDocumentDto: IngestDocumentDto,
  ): Promise<IngestResultDto> {
    return this.service.ingest(file, ingestDocumentDto);
  }
}
