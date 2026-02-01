// src/client/resources/auth.ts
import { ApiClient } from '../core'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OtpSendRequest,
  OtpSendResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types'

export class AuthResource {
  protected client: ApiClient

  constructor(client: ApiClient) {
    this.client = client
  }

  // Public method to access the client for interceptor configuration
  public getClient(): ApiClient {
    return this.client
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>(
      '/auth/registeration/',
      data,
      { skipAuth: true }
    )
    return response.data
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', data, { skipAuth: true })
    return response.data
  }

  /**
   * Send OTP to user's email
   */
  async otpSend(data: OtpSendRequest): Promise<OtpSendResponse> {
    const response = await this.client.post<OtpSendResponse>(
      '/auth/verify/',
      data,
      { skipAuth: true }
    )
    return response.data
  }

  /**
   * Verify OTP code
   */
  async otpVerify(data: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    const response = await this.client.post<OtpVerifyResponse>(
      '/auth/verify-confirm/',
      data,
      { skipAuth: true }
    )
    return response.data
  }

  /**
   * Logout user (optional - if you need server-side logout)
   */
  async logout(): Promise<void> {
    await this.client.post('/auth/logout')
  }

  /**
   * Refresh access token
   */
  async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await this.client.post<RefreshTokenResponse>(
      '/auth/refresh/',
      data,
      { skipAuth: true }
    )
    return response.data
  }

  /**
   * Refresh access token (legacy method - keeping for compatibility)
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/refresh/', {
      refresh: refreshToken,
    }, { skipAuth: true } )
    return response.data
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      '/auth/password/reset/',
      {
        email,
      },
      { skipAuth: true }
    )
    return response.data
  }
  /**
   * Request password reset
   */
  async forgotPasswordConfirm(email: string): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      '/auth/password/reset/confirm/',
      {
        email,
      },
      { skipAuth: true }
    )
    return response.data
  }
  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>(
      '/auth/change/',
      {
        token,
        password,
      }
    )
    return response.data
  }
}
