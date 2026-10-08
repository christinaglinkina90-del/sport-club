import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class NewsUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Length(2, 100)
  newTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Length(2, 1000)
  newContent?: string;
}
