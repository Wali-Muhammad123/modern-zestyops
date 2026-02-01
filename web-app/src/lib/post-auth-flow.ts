import { NavigateOptions } from '@tanstack/react-router'
import { User } from '@/client/types'

export type PostAuthFlow = 'otp-verification' | 'onboarding' | 'dashboard'

export interface PostAuthRedirect {
  flow: PostAuthFlow
  route: string
  search?: Record<string, any>
}

/**
 * Determines where to redirect user after login/signup based on their verification and onboarding status
 */
export function getPostAuthRedirect(user: User, email?: string): PostAuthRedirect {
  // Check if user needs email verification
  if (!user.is_verified) {
    return {
      flow: 'otp-verification',
      route: '/otp',
      search: {
        email: email || user.email,
        type: 'verification'
      }
    }
  }

  // Check if user needs onboarding
  if (!user.is_onboarded) {
    return {
      flow: 'onboarding',
      route: '/onboarding'
    }
  }

  // User is verified and onboarded, go to dashboard
  return {
    flow: 'dashboard',
    route: '/dashboard'
  }
}

/**
 * Navigate to the appropriate route based on user status
 */
export function handlePostAuthNavigation(
  navigate: (opts: NavigateOptions) => void,
  user: User,
  email?: string
) {
  console.log('handlePostAuthNavigation called with:', { user, email })
  
  const redirect = getPostAuthRedirect(user, email)
  
  console.log('Post-auth redirect decision:', redirect)
  
  // Use immediate navigation with window.location as fallback
  console.log('Attempting immediate navigation to:', redirect.route)
  
  try {
    navigate({
      to: redirect.route as any,
      search: redirect.search,
      replace: true,
    })
    console.log('TanStack navigation completed')
  } catch (error) {
    console.error('TanStack navigation failed, using window.location:', error)
    // Fallback to direct URL navigation
    const searchParams = redirect.search ? new URLSearchParams(redirect.search).toString() : ''
    const fullUrl = searchParams ? `${redirect.route}?${searchParams}` : redirect.route
    window.location.replace(fullUrl)
  }
  
  console.log('Navigation scheduled with:', {
    to: redirect.route,
    search: redirect.search,
    replace: true
  })
}