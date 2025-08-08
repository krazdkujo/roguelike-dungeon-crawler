import { apiClient } from './apiClient';
import { User, AuthTokens, LoginRequest, RegisterRequest } from '@/types';

class AuthService {
  private readonly TOKEN_KEY = 'auth_tokens';
  private readonly USER_KEY = 'auth_user';

  async login(credentials: LoginRequest): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    message: string;
  }> {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens and user data
    this.storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    
    this.storeUser(response.user);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    message: string;
  }> {
    const response = await apiClient.post('/auth/register', userData);
    
    // Store tokens and user data
    this.storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    
    this.storeUser(response.user);
    
    return response;
  }

  async refreshToken(): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    message: string;
  }> {
    const tokens = this.getStoredTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', {
      refreshToken: tokens.refreshToken,
    });

    // Store new tokens
    this.storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    
    this.storeUser(response.user);

    return response;
  }

  async logout(): Promise<void> {
    const tokens = this.getStoredTokens();
    
    try {
      // Attempt to logout on server
      if (tokens?.refreshToken) {
        await apiClient.post('/auth/logout', {
          refreshToken: tokens.refreshToken,
        });
      }
    } catch (error) {
      // If server logout fails, still clear local data
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local auth data
      this.clearStoredAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.user;
  }

  // Token management
  storeTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    }
  }

  getStoredTokens(): AuthTokens | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.TOKEN_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  storeUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  clearStoredAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();