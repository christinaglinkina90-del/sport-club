import { ApiProperty } from '@nestjs/swagger';
import { IngestStatus } from '../enums/ingest-status.enum';

export class IngestResultDto {
  @ApiProperty()
  documentId: string;

  @ApiProperty({ enum: IngestStatus })
  status: IngestStatus;

  // Для документа в карантине - 0.
  @ApiProperty()
  chunksCount: number;
}
