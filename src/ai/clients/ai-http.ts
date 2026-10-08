import { Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { AiProviderUnavailableException } from '../../exceptions/types/ai-provider-unavailable.exception';

export const DEFAULT_AI_REQUEST_TIMEOUT_MS: number = 30000;

// Общая отправка запроса к AI-провайдеру: с таймаутом и понятной ошибкой 503
// вместо 500, если провайдер перегружен, недоступен или не ответил вовремя.
export async function postToAiProvider<T>(
  provider: string,
  url: string,
  body: unknown,
  timeoutMs: number,
  logger: Logger,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await axios.post<T>(url, body, {
      ...config,
      timeout: timeoutMs,
    });
    return response.data;
  } catch (error) {
    // В лог пишем только код ответа или причину: url у Gemini содержит API-ключ.
    const reason: string = axios.isAxiosError(error)
      ? `${error.response?.status ?? error.code ?? 'no response'}`
      : 'unexpected error';
    logger.warn(`${provider} request failed: ${reason}`);

    throw new AiProviderUnavailableException(provider);
  }
}
