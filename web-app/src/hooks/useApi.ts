// src/lib/api/useApi.ts
import { useContext, createContext } from 'react';
import { ApiService } from '../client/services';

const ApiContext = createContext<ApiService | null>(null);

export const ApiProvider = ApiContext.Provider;

export function useApi(): ApiService {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}