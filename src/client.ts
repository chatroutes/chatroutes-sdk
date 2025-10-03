import type {
  ChatRoutesConfig,
  ApiResponse,
} from './types';
import {
  ChatRoutesError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from './errors';
import { AuthAPI } from './api/auth';
import { ConversationsAPI } from './api/conversations';
import { MessagesAPI } from './api/messages';
import { BranchesAPI } from './api/branches';

export class ChatRoutesClient {
  private config: Required<ChatRoutesConfig>;
  public auth: AuthAPI;
  public conversations: ConversationsAPI;
  public messages: MessagesAPI;
  public branches: BranchesAPI;

  constructor(config: ChatRoutesConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.chatroutes.com',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };

    this.auth = new AuthAPI(this);
    this.conversations = new ConversationsAPI(this);
    this.messages = new MessagesAPI(this);
    this.branches = new BranchesAPI(this);
  }

  async request<T>(
    method: string,
    path: string,
    data?: any,
    options: {
      headers?: Record<string, string>;
      timeout?: number;
      skipAuth?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth && this.config.apiKey) {
      headers['Authorization'] = `ApiKey ${this.config.apiKey}`;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(options.timeout || this.config.timeout),
    };

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions);

        const responseData = await response.json();

        if (!response.ok) {
          throw this.handleErrorResponse(response.status, responseData);
        }

        return responseData as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof ChatRoutesError && error.statusCode < 500) {
          throw error;
        }

        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    if (lastError instanceof ChatRoutesError) {
      throw lastError;
    }

    throw new NetworkError('Request failed after retries', { error: lastError });
  }

  async stream(
    path: string,
    data: any,
    onChunk: (chunk: any) => void,
    options: { headers?: Record<string, string> } = {}
  ): Promise<void> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `ApiKey ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw this.handleErrorResponse(response.status, errorData);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new NetworkError('No response stream available');
    }

    const decoder = new TextDecoder();

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              onChunk(parsed);
            } catch (e) {
              console.warn('Failed to parse stream chunk:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private handleErrorResponse(status: number, data: any): ChatRoutesError {
    const message = data.message || data.error || 'An error occurred';
    const details = data.details;

    switch (status) {
      case 400:
        return new ValidationError(message, details);
      case 401:
        return new AuthenticationError(message, details);
      case 404:
        return new NotFoundError(message, details);
      case 429:
        return new RateLimitError(message, data.retryAfter, details);
      default:
        return new ChatRoutesError(message, status, data.error, details);
    }
  }

  get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>('GET', path + queryString);
  }

  post<T>(path: string, data?: any, options?: { headers?: Record<string, string>; skipAuth?: boolean }): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, options);
  }

  patch<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, data);
  }

  delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}
