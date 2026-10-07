import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AiChatRequestDto {
  @ApiProperty({ example: 'какого цвета сны?' })
  @IsString()
  @Length(1, 1000)
  message: string;
}
