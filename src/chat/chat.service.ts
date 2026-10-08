import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorStorageService } from '../vector-storage/vector-storage.service';
import { AiService } from '../ai/ai.service';
import { PromptService } from '../prompts/prompt.service';
import { ChatMessage } from './types/chat-message';
import { User } from '../users/user.entity';
import { QdrantResult } from '../vector-storage/qdrant/types/search/qdrant-result';
import { ContextService } from './context.service';
import { KNOWLEDGE_SERVICE_TYPES } from '../ingestion/dto/ingest-document.dto';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger(ChatService.name);

  private readonly chatHistory: Map<number, ChatMessage[]> = new Map<
    number,
    ChatMessage[]
  >();

  constructor(
    private readonly embeddingsService: EmbeddingsService,
    private readonly vectorStorageService: VectorStorageService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly contextService: ContextService,
  ) {}

  async generateResponse(request: string, user: User): Promise<string> {
    const embedding: number[] = (
      await this.embeddingsService.generateEmbeddings([request])
    )[0];

    const chatHistory: ChatMessage[] = this.getChatHistoryByUserId(user.id);

    let prompt: string = this.promptService
      .buildPromptForServiceType()
      .withUserRole(user.role)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    this.logger.debug(`Created prompt for service type:\n${prompt}`);

    const serviceType: string = this.normalizeServiceType(
      await this.aiService.generateResponse(prompt),
    );

    const relevantChunks: QdrantResult[] =
      await this.vectorStorageService.getRelevantChunks(
        embedding,
        serviceType,
        user.role,
      );

    const context: string[] =
      this.contextService.generateContext(relevantChunks);

    prompt = this.promptService
      .buildPromptForChat()
      .withUserRole(user.role)
      .withContext(context)
      .withChatHistory(chatHistory)
      .withQuestion(request)
      .build();

    this.logger.debug(`Created prompt for AI chat:\n${prompt}`);

    const aiResponse: string = await this.aiService.generateResponse(prompt);

    this.addChatHistoryByUserId(user.id, request, aiResponse);

    return aiResponse;
  }

  private normalizeServiceType(aiResponse: string): string {
    const serviceType: string = aiResponse.trim().toLowerCase();
    return KNOWLEDGE_SERVICE_TYPES.includes(serviceType)
      ? serviceType
      : 'general';
  }

  private getChatHistoryByUserId(userId: number): ChatMessage[] {
    return this.chatHistory.get(userId)?.slice(-10) ?? [];
  }

  private addChatHistoryByUserId(
    userId: number,
    userRequest: string,
    aiResponse: string,
  ): void {
    const message: ChatMessage = new ChatMessage();
    message.userRequest = userRequest;
    message.aiAnswer = aiResponse;

    if (this.chatHistory.has(userId)) {
      this.chatHistory.get(userId)?.push(message);
    } else {
      this.chatHistory.set(userId, [message]);
    }
  }
}
