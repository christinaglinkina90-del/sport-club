import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class NewsSaveDto {
  @ApiProperty()
  @Length(2, 100)
  title: string;

  @ApiProperty()
  @Length(2, 1000)
  content: string;
}
