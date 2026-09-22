import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class NewsUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 1000)
  content?: string;
}
