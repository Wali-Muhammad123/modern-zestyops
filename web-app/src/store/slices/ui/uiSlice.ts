import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  loading: {
    global: boolean
    page: string | null
  }
  notifications: {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  }[]
  modals: {
    [key: string]: {
      isOpen: boolean
      data?: any
    }
  }
}

// Initial state
const initialState: UIState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  loading: {
    global: false,
    page: null,
  },
  notifications: [],
  modals: {},
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString())
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
      localStorage.setItem('sidebarCollapsed', action.payload.toString())
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },
    setPageLoading: (state, action: PayloadAction<string | null>) => {
      state.loading.page = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    openModal: (state, action: PayloadAction<{ key: string; data?: any }>) => {
      const { key, data } = action.payload
      state.modals[key] = {
        isOpen: true,
        data,
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const key = action.payload
      if (state.modals[key]) {
        state.modals[key].isOpen = false
        state.modals[key].data = undefined
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key].isOpen = false
        state.modals[key].data = undefined
      })
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setGlobalLoading,
  setPageLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions

export default uiSlice.reducer