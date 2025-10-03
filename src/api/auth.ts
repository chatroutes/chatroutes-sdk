import type { ChatRoutesClient } from '../client';
import type {
  RegisterRequest,
  LoginRequest,
  User,
  AuthTokens,
} from '../types';

export class AuthAPI {
  constructor(private client: ChatRoutesClient) {}

  async register(data: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.client.post<{ user: User; tokens: AuthTokens }>(
      '/api/v1/auth/register',
      data,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    return response.data;
  }

  async login(data: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.client.post<{ user: User; tokens: AuthTokens }>(
      '/api/v1/auth/login',
      data,
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    return response.data;
  }

  async me(): Promise<User> {
    const response = await this.client.get<User>('/api/v1/auth/me');

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get user info');
    }

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await this.client.post<AuthTokens>(
      '/api/v1/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Token refresh failed');
    }

    return response.data;
  }

  async logout(): Promise<void> {
    const response = await this.client.post('/api/v1/auth/logout');

    if (!response.success) {
      throw new Error(response.message || 'Logout failed');
    }
  }
}
