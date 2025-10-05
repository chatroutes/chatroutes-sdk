import type { ChatRoutesClient } from '../client';
import type {
  Message,
  SendMessageRequest,
  SendMessageResponse,
  StreamChunk,
} from '../types';

export class MessagesAPI {
  constructor(private client: ChatRoutesClient) {}

  async send(conversationId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await this.client.post<SendMessageResponse>(
      `/api/v1/conversations/${conversationId}/messages`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send message');
    }

    if (!response.data.message) {
      throw new Error('Invalid response format: missing message field');
    }

    return response.data;
  }

  async stream(
    conversationId: string,
    data: SendMessageRequest,
    onChunk: (chunk: StreamChunk) => void,
    onComplete?: (response: SendMessageResponse) => void
  ): Promise<void> {
    await this.client.stream(
      `/api/v1/conversations/${conversationId}/messages/stream`,
      data,
      (chunk: StreamChunk) => {
        onChunk(chunk);

        if (chunk.type === 'complete' && onComplete && chunk.message && chunk.usage && chunk.model) {
          const completeResponse: SendMessageResponse = {
            message: chunk.message,
            usage: chunk.usage,
            model: chunk.model,
          };
          onComplete(completeResponse);
        }
      }
    );
  }

  async list(conversationId: string, branchId?: string): Promise<Message[]> {
    const params: Record<string, string> = {};
    if (branchId) {
      params.branchId = branchId;
    }

    const response = await this.client.get<{ messages: Message[] }>(
      `/api/v1/conversations/${conversationId}/messages`,
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to list messages');
    }

    return response.data.messages;
  }

  async update(messageId: string, content: string): Promise<Message> {
    const response = await this.client.patch<{ message: Message }>(
      `/api/v1/messages/${messageId}`,
      { content }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update message');
    }

    return response.data.message;
  }

  async delete(messageId: string): Promise<void> {
    const response = await this.client.delete(`/api/v1/messages/${messageId}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete message');
    }
  }
}
