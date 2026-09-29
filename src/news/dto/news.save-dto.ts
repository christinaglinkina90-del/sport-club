import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class NewsSaveDto {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(2, 1000)
  content: string;
}
