// src/client/index.ts
export { ApiClient } from './core';
export { ApiResource } from './resource';
export { createApiService } from './services';
export type { ApiService } from './services';
export type { ApiClientConfig } from './core';

// Export types
export type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OtpSendRequest,
  OtpSendResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ApiError,
} from './types';

// Export resources
export { AuthResource } from './resources/auth';
export { UserResource } from './resources/user';