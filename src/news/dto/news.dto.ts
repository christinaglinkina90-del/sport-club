import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}
