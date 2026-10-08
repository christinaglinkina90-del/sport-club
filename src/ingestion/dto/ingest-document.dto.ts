import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, Min } from 'class-validator';

export const KNOWLEDGE_SERVICE_TYPES: string[] = [
  'gym',
  'yoga',
  'equestrian',
  'spa',
  'restaurant',
  'golf',
  'general',
];

export class IngestDocumentDto {
  @ApiProperty({ enum: KNOWLEDGE_SERVICE_TYPES })
  @IsIn(KNOWLEDGE_SERVICE_TYPES)
  serviceType: string;

  @ApiProperty({ example: 'ru' })
  @IsNotEmpty()
  language: string;

  @ApiProperty()
  @Transform(({ value }: TransformFnParams): boolean | string => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  publicAccess: boolean;

  @ApiProperty()
  @Transform(({ value }: TransformFnParams): number => Number(value))
  @IsInt()
  @Min(1)
  documentVersion: number;

  @ApiProperty()
  @IsNotEmpty()
  documentId: string;
}
