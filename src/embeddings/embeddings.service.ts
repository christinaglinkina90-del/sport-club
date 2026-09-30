import { Injectable } from '@nestjs/common';
import { CreateEmbeddingsRequestDTO } from './dto/create-embeddings-request.dto';

@Injectable()
export class EmbeddingsService {
  async generateEmbeddings(
    requestDto: CreateEmbeddingsRequestDTO,
  ): Promise<void> {

  }
}