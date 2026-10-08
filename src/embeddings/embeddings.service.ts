import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EmbeddingsService {
  private readonly logger: Logger = new Logger(EmbeddingsService.name);

  constructor(private readonly aiService: AiService) {}

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] =
      await this.aiService.generateEmbeddings(texts);

    for (const embedding of embeddings) {
      this.logger.debug(`Embedding calculated: ${embedding.length} dimensions`);
    }

    return embeddings;
  }
}
