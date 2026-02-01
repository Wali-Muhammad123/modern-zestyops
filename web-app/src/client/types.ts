// API Types
export interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    is_verified: boolean;
    is_onboarded: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh?: string;
}

export interface RegisterRequest {
  email: string;
  password1: string;
  password2: string;
  phone_number?: string;
  role: 'MANAGER' | 'OWNER';
//   name?: string;
}

export interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface OtpSendRequest {
  email: string;
  purpose: 1 | 2 | 3 | 4; // 1: USER_VERIFICATION, 2: PASSWORD_RESET, 3: Forgot Password, 4: USER_DELETE
//   type?: 'login' | 'register' | 'forgot_password';
}

export interface OtpSendResponse {
    message: string;
}

export interface OtpVerifyRequest {
  email: string;
  code: string;
//   type?: 'login' | 'register' | 'forgot_password';
}

export interface OtpVerifyResponse {
//   user?: User;
//   accessToken?: string;
//   refreshToken?: string;
  message: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
  user?: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface OnboardingRequest {
  restaurant_name: string;
  restaurant_domain: string;
}
export interface OnboardingResponse {
  user_id: number;
  restaurant: {
    name: string;
    domain: string;
  };
  message: string;
}