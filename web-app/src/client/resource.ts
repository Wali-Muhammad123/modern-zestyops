// src/client/resource.ts
import { ApiClient } from './core';

export interface ResourceConfig {
  resourcePath: string;
}

export abstract class ApiResource<T = any> {
  protected client: ApiClient;
  protected resourcePath: string;

  constructor(client: ApiClient, config: ResourceConfig) {
    this.client = client;
    this.resourcePath = config.resourcePath;
  }

  // Public method to access the client for interceptor configuration
  public getClient(): ApiClient {
    return this.client;
  }

  async getAll(params?: any): Promise<T[]> {
    const response = await this.client.get<T[]>(this.resourcePath, { params });
    return response.data;
  }

  async getById(id: string | number): Promise<T> {
    const response = await this.client.get<T>(`${this.resourcePath}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await this.client.post<T>(this.resourcePath, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await this.client.put<T>(`${this.resourcePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await this.client.delete(`${this.resourcePath}/${id}`);
  }
}