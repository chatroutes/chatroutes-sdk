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

    return response.data;
  }

  async stream(
    conversationId: string,
    data: SendMessageRequest,
    onChunk: (chunk: StreamChunk) => void,
    onComplete?: (response: SendMessageResponse) => void
  ): Promise<void> {
    let fullContent = '';
    const userMessageId = '';
    const assistantMessageId = '';

    await this.client.stream(
      `/api/v1/conversations/${conversationId}/messages/stream`,
      data,
      (chunk: StreamChunk) => {
        if (chunk.choices?.[0]?.delta?.content) {
          fullContent += chunk.choices[0].delta.content;
        }

        onChunk(chunk);

        if (chunk.choices?.[0]?.finish_reason) {
          if (onComplete) {
            const completeResponse: SendMessageResponse = {
              userMessage: {
                id: userMessageId || `msg_${Date.now()}_user`,
                conversationId,
                role: 'user',
                content: data.content,
                createdAt: new Date().toISOString(),
              },
              assistantMessage: {
                id: assistantMessageId || `msg_${Date.now()}_assistant`,
                conversationId,
                role: 'assistant',
                content: fullContent,
                createdAt: new Date().toISOString(),
                metadata: {
                  model: chunk.model,
                  finishReason: chunk.choices[0].finish_reason,
                },
              },
            };
            onComplete(completeResponse);
          }
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
