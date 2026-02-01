// src/client/resources/user.ts
import { ApiResource } from '../resource';
import { User } from '../types';

export class UserResource extends ApiResource<User> {
  constructor(client: any) {
    super(client, { resourcePath: '/users' });
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    return this.update(id, data);
  }
}