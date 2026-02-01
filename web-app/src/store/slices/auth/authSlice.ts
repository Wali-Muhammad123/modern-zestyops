import { User } from '@/client/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cookieManager } from '@/lib/cookies'
import {
  loginUser,
  registerUser,
  sendOTP,
  submitUserOnboarding,
  verifyOTP,
  logoutUser,
  refreshAccessToken,
} from './authSliceThunk'

export {
  loginUser,
  registerUser,
  sendOTP,
  submitUserOnboarding,
  verifyOTP,
  logoutUser,
  refreshAccessToken,
}

import { AuthState } from './interface'

// Types

// Initial state
const initialState: AuthState = {
  user: cookieManager.get('USER_PREFS'),
  accessToken: cookieManager.get('AUTH_TOKEN'),
  refreshToken: cookieManager.get('REFRESH_TOKEN'),
  isAuthenticated: !!cookieManager.get('AUTH_TOKEN'),
  isLoading: false,
  error: null,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken?: string
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken || null
      state.isAuthenticated = true
      state.error = null

      // Store in cookies and localStorage
      cookieManager.set('AUTH_TOKEN', accessToken)
      cookieManager.set('USER_PREFS', user)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        // Update user data in cookies
        cookieManager.set('USER_PREFS', state.user)
      }
    },
    resetAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false

      // Clear cookies and localStorage
      cookieManager.remove('AUTH_TOKEN')
      cookieManager.remove('USER_PREFS')
      localStorage.removeItem('refreshToken')
      sessionStorage.clear()
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh || null
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh || null
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Still reset auth state even if logout fails
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = action.payload as string
      })

    // Refresh token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.access
        if (action.payload.refresh) {
          state.refreshToken = action.payload.refresh
        }
        if (action.payload.user) {
          state.user = action.payload.user
        }
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        // If refresh fails, clear all auth data
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCredentials, updateUser, resetAuth } =
  authSlice.actions
export default authSlice.reducer
