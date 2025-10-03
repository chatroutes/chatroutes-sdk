import type { ChatRoutesClient } from '../client';
import type {
  Conversation,
  CreateConversationRequest,
  ListConversationsParams,
  PaginatedResponse,
  ConversationTree,
} from '../types';

export class ConversationsAPI {
  constructor(private client: ChatRoutesClient) {}

  async create(data: CreateConversationRequest): Promise<Conversation> {
    const response = await this.client.post<{ conversation: Conversation }>(
      '/api/v1/conversations',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create conversation');
    }

    return response.data.conversation;
  }

  async list(params?: ListConversationsParams): Promise<PaginatedResponse<Conversation>> {
    const response = await this.client.get<{ conversations: Conversation[]; total: number; page: number; limit: number }>(
      '/api/v1/conversations',
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to list conversations');
    }

    return {
      data: response.data.conversations,
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
    };
  }

  async get(conversationId: string): Promise<Conversation> {
    const response = await this.client.get<{ conversation: Conversation }>(
      `/api/v1/conversations/${conversationId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get conversation');
    }

    return response.data.conversation;
  }

  async update(conversationId: string, data: Partial<Conversation>): Promise<Conversation> {
    const response = await this.client.patch<{ conversation: Conversation }>(
      `/api/v1/conversations/${conversationId}`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update conversation');
    }

    return response.data.conversation;
  }

  async delete(conversationId: string): Promise<void> {
    const response = await this.client.delete(`/api/v1/conversations/${conversationId}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete conversation');
    }
  }

  async getTree(conversationId: string): Promise<ConversationTree> {
    const response = await this.client.get<ConversationTree>(
      `/api/v1/conversations/${conversationId}/tree`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get conversation tree');
    }

    return response.data;
  }
}
