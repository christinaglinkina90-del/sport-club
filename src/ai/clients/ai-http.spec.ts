import { Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { postToAiProvider } from './ai-http';
import { AiProviderUnavailableException } from '../../exceptions/types/ai-provider-unavailable.exception';

describe('postToAiProvider', (): void => {
  const logger: Logger = new Logger('test');

  beforeEach((): void => {
    vi.spyOn(logger, 'warn').mockImplementation((): void => {});
  });

  afterEach((): void => {
    vi.restoreAllMocks();
  });

  it('should return response data and pass the timeout', async (): Promise<void> => {
    const post = vi
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: { answer: 42 } });

    const result: { answer: number } = await postToAiProvider<{
      answer: number;
    }>('Gemini', 'https://ai.test?key=secret', { q: 1 }, 1234, logger);

    expect(result).toEqual({ answer: 42 });
    expect(post).toHaveBeenCalledWith(
      'https://ai.test?key=secret',
      { q: 1 },
      expect.objectContaining({ timeout: 1234 }),
    );
  });

  it('should throw 503 exception when provider is overloaded', async (): Promise<void> => {
    const error: AxiosError = new AxiosError(
      'Request failed with status code 503',
    );
    error.response = { status: 503 } as AxiosError['response'];
    vi.spyOn(axios, 'post').mockRejectedValue(error);

    const resultPromise: Promise<unknown> = postToAiProvider(
      'Gemini',
      'https://ai.test?key=secret',
      {},
      1000,
      logger,
    );

    await expect(resultPromise).rejects.toBeInstanceOf(
      AiProviderUnavailableException,
    );
    await expect(resultPromise).rejects.toThrow(
      'Gemini AI provider is temporarily unavailable',
    );
  });

  it('should throw 503 exception on timeout without leaking the url', async (): Promise<void> => {
    const error: AxiosError = new AxiosError(
      'timeout of 1000ms exceeded',
      'ECONNABORTED',
    );
    vi.spyOn(axios, 'post').mockRejectedValue(error);

    await expect(
      postToAiProvider(
        'Gemini',
        'https://ai.test?key=secret',
        {},
        1000,
        logger,
      ),
    ).rejects.toBeInstanceOf(AiProviderUnavailableException);

    expect(logger.warn).toHaveBeenCalledWith(
      'Gemini request failed: ECONNABORTED',
    );
  });
});
