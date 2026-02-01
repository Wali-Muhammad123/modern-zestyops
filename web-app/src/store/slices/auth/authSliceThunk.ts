import { LoginRequest, RegisterRequest } from '@/client/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/lib/api'
import { cookieManager } from '@/lib/cookies'
import { AuthState } from './interface'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(credentials)

      // Store access token in cookies and user data
      cookieManager.set('AUTH_TOKEN', response.access)
      cookieManager.set('USER_PREFS', response.user)

      // Store refresh token in localStorage for security
      if (response.refresh) {
        cookieManager.set('REFRESH_TOKEN', response.refresh)
      }

      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await api.auth.register(userData)

      // Store access token in cookies and user data
      cookieManager.set('AUTH_TOKEN', response.access)
      cookieManager.set('USER_PREFS', response.user)

      // Store refresh token in localStorage for security
      if (response.refresh) {
        cookieManager.set('REFRESH_TOKEN', response.refresh)
      }

      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (
    { email, purpose }: { email: string; purpose: 1 | 2 | 3 | 4 },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.auth.otpSend({ email, purpose })
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP'
      )
    }
  }
)
export const submitUserOnboarding = createAsyncThunk(
  'auth/submitOnboarding',
  async (
    onboardingData: { restaurant_name: string; restaurant_domain: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState }
      const accessToken = state.auth.accessToken

      if (!accessToken) {
        throw new Error('No access token available')
      }

      // Call onboarding endpoint (you'll need to implement this in your API)
      const response = await api.onboarding.submitOnboarding(onboardingData)

      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Onboarding submission failed'
      )
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.auth.otpVerify({ email, code })
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      //   await api.auth.logout()

      // Clear tokens from cookies and localStorage
      cookieManager.remove('AUTH_TOKEN')
      cookieManager.remove('USER_PREFS')
      cookieManager.remove('REFRESH_TOKEN')
      sessionStorage.clear()

      return null
    } catch (error: any) {
      // Still clear storage even if server logout fails
      cookieManager.remove('AUTH_TOKEN')
      cookieManager.remove('USER_PREFS')
      cookieManager.remove('REFRESH_TOKEN')
      sessionStorage.clear()

      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const refreshToken = state.auth.refreshToken

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Call refresh endpoint (you'll need to implement this in your API)
      const response = await api.auth.refresh({ refresh: refreshToken })

      // Store new access token in cookies
      cookieManager.set('AUTH_TOKEN', response.access)

      // Store new refresh token in localStorage if provided
      if (response.refresh) {
        localStorage.setItem('refreshToken', response.refresh)
      }

      return response
    } catch (error: any) {
      // If refresh fails, clear all auth data
      cookieManager.remove('AUTH_TOKEN')
      cookieManager.remove('USER_PREFS')
      localStorage.removeItem('refreshToken')
      sessionStorage.clear()

      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      )
    }
  }
)
