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
  StreamChunk,
  Branch,
  CreateBranchRequest,
  ForkConversationRequest,
  ConversationTree,
  TreeNode,
  ListConversationsParams,
  PaginatedResponse,
} from './types';
