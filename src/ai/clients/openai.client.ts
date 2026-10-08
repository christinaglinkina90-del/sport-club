import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { OpenAiRequest } from '../types/openai/openai-request';
import { OpenAiResponse } from '../types/openai/openai-response';
import { OpenAiEmbeddingsResponse } from '../types/openai/openai-embeddings-response';
import { OpenAiEmbedding } from '../types/openai/openai-embedding';
import { DEFAULT_AI_REQUEST_TIMEOUT_MS, postToAiProvider } from './ai-http';

@Injectable()
export class OpenAiClient {
  private readonly logger: Logger = new Logger(OpenAiClient.name);

  constructor(private readonly configService: ConfigService) {}

  async generateContent(request: OpenAiRequest): Promise<string> {
    const url: string = this.configService.getOrThrow('OPENAI_API_URL');

    const response: OpenAiResponse = await postToAiProvider<OpenAiResponse>(
      'OpenAI',
      url,
      request,
      this.getTimeout(),
      this.logger,
      this.getRequestConfig(),
    );

    return response.output[0].content[0].text;
  }

  async generateEmbeddings(request: OpenAiRequest): Promise<number[][]> {
    const url: string = this.configService.getOrThrow('OPENAI_EMBEDDING_URL');

    const response: OpenAiEmbeddingsResponse =
      await postToAiProvider<OpenAiEmbeddingsResponse>(
        'OpenAI',
        url,
        request,
        this.getTimeout(),
        this.logger,
        this.getRequestConfig(),
      );

    return response.data.map((e: OpenAiEmbedding): number[] => e.embedding);
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${this.configService.getOrThrow('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    };
  }

  private getTimeout(): number {
    return Number(
      this.configService.get('AI_REQUEST_TIMEOUT_MS') ??
        DEFAULT_AI_REQUEST_TIMEOUT_MS,
    );
  }
}
