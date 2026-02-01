import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/auth/authSlice.js'
import reservationReducer from './slices/reservation/reservationSlice.js'
import uiReducer from './slices/ui/uiSlice.js'
import foodReducer from './slices/food/foodSlice.js'
import menuTypeReducer from './slices/food/menutype/menuTypeSlice.js'
import variantReducer from './slices/food/variant/variantSlice.js'
import availabilityReducer from './slices/food/availability/availabilitySlice.js'
import categoryReducer from './slices/food/category/categorySlice.js'
import addonReducer from './slices/food/addon/addonSlice.js'
import orderReducer from './slices/order/orderSlice.js'
import userReducer from './slices/user/userSlice.js'
import kitchenReducer from './slices/kitchen/kitchenSlice.js'
import tableReducer from './slices/table/tableSlice.js'
import dashboardReducer from './slices/dashboard/dashboardSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    reservation: reservationReducer,
    food: foodReducer,
    menuType: menuTypeReducer,
    variant: variantReducer,
    availability: availabilityReducer,
    category: categoryReducer,
    addon: addonReducer,
    order: orderReducer,
    user: userReducer,
    kitchen: kitchenReducer,
    table: tableReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
