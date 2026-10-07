import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmbeddingsRequestDTO } from './dto/create-embeddings-request.dto';
import { Public } from '../auth/types/auth.decorators';

@Controller('embeddings')
export class EmbeddingsController {
  @Public()
  @Post()
  async generateEmbeddings(
    @Body() requestDto: CreateEmbeddingsRequestDTO,
  ): Promise<void> {
    return;
  }
}
