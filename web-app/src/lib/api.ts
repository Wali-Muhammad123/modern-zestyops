// src/lib/api.ts
import { createApiService } from '@/client';
import { tokenManager } from './token-manager';
import { store } from '@/store';
import { resetAuth } from '@/store/slices/auth/authSlice';

// Create the API service instance
export const api = createApiService({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true,
});

// Apply interceptors to all resources except auth endpoints
Object.entries(api).forEach(([resourceName, resource]) => {
  if (resource && typeof resource === 'object' && 'getClient' in resource) {
    const client = (resource as any).getClient();
    
    // Skip adding auth interceptor for auth endpoints
    if (resourceName === 'auth') {
      console.log('Skipping auth interceptor for auth resource');
      return;
    }
    
    // Add auth interceptor with synchronous token getter for non-auth endpoints
    client.addAuthInterceptor(() => {
      const state = store.getState().auth;
      return state.accessToken;
    });
    
    // Add response interceptor for 401 handling and token refresh (not for auth endpoints)
    client.addResponseInterceptor(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        
        // Skip token refresh logic for auth endpoints
        if (resourceName === 'auth') {
          return Promise.reject(error);
        }
        
        // If it's a 401 error and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const newToken = await tokenManager.getValidAccessToken();
            
            if (newToken) {
              // Update the Authorization header and retry the request
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return client.request(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
          
          // If refresh failed, clear auth state and redirect
          console.error('Unauthorized access - clearing auth state');
          store.dispatch(resetAuth());
          
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
});

export default api;