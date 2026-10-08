import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiChatRequest } from '../types/gemini/gemini-chat-request';
import { GeminiChatResponse } from '../types/gemini/gemini-chat-response';
import { GeminiEmbedRequest } from '../types/gemini/gemini-embed-request';
import { GeminiEmbedResponse } from '../types/gemini/gemini-embed-response';
import { DEFAULT_AI_REQUEST_TIMEOUT_MS, postToAiProvider } from './ai-http';

@Injectable()
export class GeminiClient {
  private readonly logger: Logger = new Logger(GeminiClient.name);

  constructor(private readonly configService: ConfigService) {}

  async generateContent(request: GeminiChatRequest): Promise<string> {
    const baseUrl: string = this.configService.getOrThrow('GEMINI_API_URL');
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: GeminiChatResponse =
      await postToAiProvider<GeminiChatResponse>(
        'Gemini',
        url,
        request,
        this.getTimeout(),
        this.logger,
      );

    return response.candidates[0].content.parts[0].text;
  }

  async generateEmbedding(request: GeminiEmbedRequest): Promise<number[]> {
    const baseUrl: string = this.configService.getOrThrow(
      'GEMINI_EMBEDDING_URL',
    );
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: GeminiEmbedResponse =
      await postToAiProvider<GeminiEmbedResponse>(
        'Gemini',
        url,
        request,
        this.getTimeout(),
        this.logger,
      );

    return response.embedding.values;
  }

  private getTimeout(): number {
    return Number(
      this.configService.get('AI_REQUEST_TIMEOUT_MS') ??
        DEFAULT_AI_REQUEST_TIMEOUT_MS,
    );
  }
}
