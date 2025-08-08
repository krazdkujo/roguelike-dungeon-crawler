import { apiClient } from '@/services/apiClient';
import { store } from '@/stores/store';
import { clearAuth, refreshToken } from '@/stores/authSlice';

// Configure apiClient with store callbacks to avoid circular dependencies
export function configureApiClient() {
  apiClient.configure({
    getTokens: () => {
      const state = store.getState();
      return state.auth.tokens;
    },
    onTokenRefresh: async () => {
      await store.dispatch(refreshToken());
    },
    onAuthClear: () => {
      store.dispatch(clearAuth());
    }
  });
}