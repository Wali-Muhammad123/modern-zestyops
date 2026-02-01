import { store } from '@/store'
import { refreshAccessToken, resetAuth } from '@/store/slices/auth/authSlice'
// Removed unused import - using direct cookie functions

export class TokenManager {
  private static instance: TokenManager
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  private constructor() { }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  /**
   * Check if access token is expired or about to expire
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      // Check if token expires in the next 5 minutes (300 seconds)
      return payload.exp < (currentTime + 300)
    } catch {
      return true // If we can't parse the token, consider it expired
    }
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  public async getValidAccessToken(): Promise<string | null> {
    const state = store.getState().auth
    const accessToken = state.accessToken

    if (!accessToken) {
      return null
    }

    // If token is not expired, return it
    if (!this.isTokenExpired(accessToken)) {
      return accessToken
    }

    // If we're already refreshing, wait for that to complete
    if (this.isRefreshing && this.refreshPromise) {
      const success = await this.refreshPromise
      return success ? store.getState().auth.accessToken : null
    }

    // Start refresh process
    return this.refreshToken()
  }

  /**
   * Refresh the access token
   */
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return null
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      const success = await this.refreshPromise
      return success ? store.getState().auth.accessToken : null
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performRefresh(): Promise<boolean> {
    try {
      const result = await store.dispatch(refreshAccessToken())
      return refreshAccessToken.fulfilled.match(result)
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout user
      store.dispatch(resetAuth())
      return false
    }
  }

  /**
   * Initialize token refresh on app startup
   */
  public initializeTokenRefresh(): void {
    // Check token on app initialization
    this.getValidAccessToken().catch(error => {
      console.error('Initial token validation failed:', error)
    })

    // Set up periodic token validation (every 5 minutes)
    setInterval(() => {
      const state = store.getState().auth
      if (state.isAuthenticated && state.accessToken) {
        this.getValidAccessToken().catch(error => {
          console.error('Periodic token validation failed:', error)
        })
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  /**
   * Clear all tokens
   */
  public clearTokens(): void {
    store.dispatch(resetAuth())
  }
}

export const tokenManager = TokenManager.getInstance()