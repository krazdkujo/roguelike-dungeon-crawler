import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, Modal } from '@/types';

interface UIState {
  notifications: Notification[];
  activeModal: Modal | null;
  loading: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  notifications: [],
  activeModal: null,
  loading: false,
  theme: 'dark', // Default to dark theme for SNES aesthetic
};

let notificationIdCounter = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        id: `notification_${++notificationIdCounter}`,
        ...action.payload,
      };
      
      state.notifications.push(notification);
      
      // Auto-remove after duration (default 5 seconds)
      const duration = notification.duration || 5000;
      if (duration > 0) {
        setTimeout(() => {
          // Note: This won't work in the slice, we need to handle this in components
        }, duration);
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    showModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.activeModal = {
        id: `modal_${Date.now()}`,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    
    hideModal: (state) => {
      state.activeModal = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      
      // Save theme preference to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    
    initializeTheme: (state) => {
      // Load theme from localStorage or system preference
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
          state.theme = savedTheme;
        } else {
          // Use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          state.theme = prefersDark ? 'dark' : 'light';
        }
      }
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  showModal,
  hideModal,
  setLoading,
  setTheme,
  initializeTheme
} = uiSlice.actions;

export default uiSlice.reducer;