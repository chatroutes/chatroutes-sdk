import type { ChatRoutesClient } from '../client';
import type {
  Branch,
  CreateBranchRequest,
  ForkConversationRequest,
  Message,
} from '../types';

export class BranchesAPI {
  constructor(private client: ChatRoutesClient) {}

  async list(conversationId: string): Promise<Branch[]> {
    const response = await this.client.get<{ branches: Branch[] }>(
      `/api/v1/conversations/${conversationId}/branches`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to list branches');
    }

    return response.data.branches;
  }

  async create(conversationId: string, data: CreateBranchRequest): Promise<Branch> {
    const response = await this.client.post<{ branch: Branch }>(
      `/api/v1/conversations/${conversationId}/branches`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create branch');
    }

    return response.data.branch;
  }

  async fork(conversationId: string, data: ForkConversationRequest): Promise<Branch> {
    const response = await this.client.post<{ branch: Branch }>(
      `/api/v1/conversations/${conversationId}/fork`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fork conversation');
    }

    return response.data.branch;
  }

  async update(conversationId: string, branchId: string, data: Partial<Branch>): Promise<Branch> {
    const response = await this.client.patch<{ branch: Branch }>(
      `/api/v1/conversations/${conversationId}/branches/${branchId}`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update branch');
    }

    return response.data.branch;
  }

  async delete(conversationId: string, branchId: string): Promise<void> {
    const response = await this.client.delete(
      `/api/v1/conversations/${conversationId}/branches/${branchId}`
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete branch');
    }
  }

  async getMessages(conversationId: string, branchId: string): Promise<Message[]> {
    const response = await this.client.get<{ messages: Message[] }>(
      `/api/v1/conversations/${conversationId}/branches/${branchId}/messages`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get branch messages');
    }

    return response.data.messages;
  }
}
