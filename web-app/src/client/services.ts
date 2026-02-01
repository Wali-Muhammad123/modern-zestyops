// src/client/services.ts
import { ApiClient, ApiClientConfig } from './core';
// import { UserResource } from './resources/user';
import { AuthResource } from './resources/auth';
import { OnboardingResource } from './resources/onboarding';

export interface ApiService {
  auth: AuthResource;
  onboarding: OnboardingResource;
//   users: UserResource;
  // Add more resources here as needed
}

export function createApiService(config: ApiClientConfig): ApiService {
  const client = new ApiClient(config);

  // Add auth interceptor to automatically add Bearer tokens
  client.addAuthInterceptor(() => {
    // Get token from your auth store or localStorage
    return localStorage.getItem('accessToken');
  });

  return {
    auth: new AuthResource(client),
    onboarding: new OnboardingResource(client),
    // users: new UserResource(client),
  };
}