import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from '@/types';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: any[] = [];
  private getTokens: (() => AuthTokens | null) | null = null;
  private onTokenRefresh: (() => Promise<void>) | null = null;
  private onAuthClear: (() => void) | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Configure callbacks to avoid circular dependencies
  configure(callbacks: {
    getTokens: () => AuthTokens | null;
    onTokenRefresh: () => Promise<void>;
    onAuthClear: () => void;
  }) {
    this.getTokens = callbacks.getTokens;
    this.onTokenRefresh = callbacks.onTokenRefresh;
    this.onAuthClear = callbacks.onAuthClear;
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.getTokens) {
          const tokens = this.getTokens();
          const token = tokens?.accessToken;
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry && this.onTokenRefresh && this.onAuthClear) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh token
            await this.onTokenRefresh();
            
            // Process queued requests
            this.processQueue(null);
            
            // Retry original request
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            this.processQueue(refreshError);
            this.onAuthClear();
            
            // Redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    
    this.failedQueue = [];
  }

  // HTTP methods
  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  // Get raw axios instance for special cases
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();