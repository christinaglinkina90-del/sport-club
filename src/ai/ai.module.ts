import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiClient } from './clients/gemini.client';

@Module({
  controllers: [AiController],
  providers: [AiService, GeminiClient],
})
export class AiModule {}
