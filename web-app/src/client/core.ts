// src/client/core.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export class ApiClient {
  protected axios: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.axios = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: config.withCredentials || false,
    });
  }

  // Request interceptor for authentication
  addAuthInterceptor(getToken: () => string | null) {
    this.axios.interceptors.request.use(
      (config: import('axios').InternalAxiosRequestConfig<any>) => {
        const token = getToken();

        // Only attach Authorization if not explicitly skipped
        if (token && !(config as ExtendedAxiosRequestConfig).skipAuth) {
          if (!config.headers) {
            config.headers = {} as import('axios').AxiosRequestHeaders;
          }
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Response interceptor for error handling
  addResponseInterceptor(
    onResponse?: (response: AxiosResponse) => AxiosResponse,
    onError?: (error: any) => any
  ) {
    this.axios.interceptors.response.use(
      (response) => onResponse ? onResponse(response) : response,
      (error) => onError ? onError(error) : Promise.reject(error)
    );
  }

  async request<T>(config: ExtendedAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.request<T>(config);
  }

  async get<T>(url: string, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axios.delete<T>(url, config);
  }
}