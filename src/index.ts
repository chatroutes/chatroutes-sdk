export { ChatRoutesClient } from './client';
export { AuthAPI } from './api/auth';
export { ConversationsAPI } from './api/conversations';
export { MessagesAPI } from './api/messages';
export { BranchesAPI } from './api/branches';

export {
  ChatRoutesError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from './errors';

export type {
  ChatRoutesConfig,
  ApiResponse,
  User,
  AuthTokens,
  RegisterRequest,
  LoginRequest,
  Conversation,
  CreateConversationRequest,
  Message,
  SendMessageRequest,
  SendMessageResponse,
  UsageStats,
  StreamChunk,
  Branch,
  CreateBranchRequest,
  ForkConversationRequest,
  ConversationTree,
  ListConversationsParams,
  PaginatedResponse,
} from './types';
