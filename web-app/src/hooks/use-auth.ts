import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { refreshAccessToken } from '@/store/slices/auth/authSlice'
import { tokenManager } from '@/lib/token-manager'

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const getValidToken = useCallback(async () => {
    return await tokenManager.getValidAccessToken()
  }, [])

  const refreshAuthToken = useCallback(async () => {
    const result = await dispatch(refreshAccessToken())
    return refreshAccessToken.fulfilled.match(result)
  }, [dispatch])

  const clearAuth = useCallback(() => {
    tokenManager.clearTokens()
  }, [])

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    getValidToken,
    refreshAuthToken,
    clearAuth,
  }
}