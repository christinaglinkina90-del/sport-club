import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AiChatRequestDto {
  @ApiProperty({ example: 'Во сколько открывается бассейн?' })
  @Length(1, 1000)
  message: string;
}
