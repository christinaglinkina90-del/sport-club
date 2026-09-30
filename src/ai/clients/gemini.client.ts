import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiChatRequest } from '../types/gemini/gemini-chat-request';
import axios, { AxiosResponse } from 'axios';
import { GeminiResponse } from '../types/gemini/gemini-response';
import { GeminiEmbedRequest } from '../types/gemini/gemini-embed-request';

@Injectable()
export class GeminiClient {
  constructor( private readonly configService: ConfigService ) {}
  
  async generateContent( request: GeminiChatRequest) : Promise<string> {
    const baseUrl: string = this.configService.getOrThrow('GEMINI_API_URL');
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response: AxiosResponse<GeminiResponse> = await axios.post <GeminiResponse>(url, request,);
    

    return response.data.candidates[0].content.parts[0].text;

  }
  async generateEmbedding(request: GeminiEmbedRequest) : Promise<number[]> {
    const baseUrl: string = this.configService.getOrThrow('GEMINI_EMBEDDING_URL');
    const key: string = this.configService.getOrThrow('GEMINI_API_KEY');
    const url: string = baseUrl + key;

    const response = await axios.post(url, request,);
    return [];
  }

}