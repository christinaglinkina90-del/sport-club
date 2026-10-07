import { Injectable } from '@nestjs/common';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { GeminiPart } from './types/gemini/gemini-part';
import { GeminiContent } from './types/gemini/gemini-content';
import { GeminiChatRequest } from './types/gemini/gemini-chat-request';
import { GeminiClient } from './clients/gemini.client';

import { GeminiEmbedRequest } from './types/gemini/gemini-embed-request';
import { GeminiEmbedContentConfig } from './types/gemini/gemini-embed-content-config';

@Injectable()
export class AiService {
  constructor(private readonly client: GeminiClient) {}
  async generateResponse(chatRequestDto: AiChatRequestDto): Promise<string> {
    const part: GeminiPart = new GeminiPart();
    part.text = chatRequestDto.message;

    const content: GeminiContent = new GeminiContent();
    content.parts = [part];

    const request: GeminiChatRequest = new GeminiChatRequest();
    request.contents = [content];

    return this.client.generateContent(request);
  }
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const parts: GeminiPart[] = this.convertTextsToPart(texts);
    const result: number[][] = [];
    for (const part of parts) {
      const content: GeminiContent = new GeminiContent();
      content.parts = [part];

      const request: GeminiEmbedRequest = new GeminiEmbedRequest();
      request.content = content;
      request.embedContentConfig = new GeminiEmbedContentConfig();

      const embeding: number[] = await this.client.generateEmbedding(request);
      result.push(embeding);
    }
    return result;
  }

  private convertTextsToPart(texts: string[]): GeminiPart[] {
    return texts.map((t: string): GeminiPart => {
      const part: GeminiPart = new GeminiPart();
      part.text = t;
      return part;
    });
  }
}
