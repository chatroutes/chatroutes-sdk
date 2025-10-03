export interface ChatRoutesConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface User {
  id: string;
  email: string;
  plan?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  branches?: Branch[];
}

export interface CreateConversationRequest {
  title: string;
  model?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  branchId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokenCount?: number;
  createdAt: string;
  metadata?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseTime?: number;
    finishReason?: string;
    cost?: number;
  };
}

export interface SendMessageRequest {
  content: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  branchId?: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}

export interface StreamChunk {
  id: string;
  model: string;
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
    index: number;
  }>;
  created: number;
}

export interface Branch {
  id: string;
  conversationId: string;
  parentBranchId?: string;
  forkPointMessageId?: string;
  title: string;
  contextMode?: 'FULL' | 'PARTIAL' | 'MINIMAL';
  isMain: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  messageCount?: number;
}

export interface CreateBranchRequest {
  title: string;
  baseNodeId?: string;
  description?: string;
  contextMode?: 'FULL' | 'PARTIAL' | 'MINIMAL';
}

export interface ForkConversationRequest {
  forkPointMessageId: string;
  title: string;
  contextMode?: 'FULL' | 'PARTIAL' | 'MINIMAL';
}

export interface ConversationTree {
  conversation: Conversation;
  tree: TreeNode;
  metadata: {
    totalNodes: number;
    totalBranches: number;
    maxDepth: number;
  };
}

export interface TreeNode {
  id: string;
  content: string;
  role: string;
  children: TreeNode[];
  branchInfo?: {
    branchId: string;
    branchName: string;
  };
}

export interface ListConversationsParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'owned' | 'shared';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext?: boolean;
}

export interface ChatRoutesError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
