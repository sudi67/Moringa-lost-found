import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/itemsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});
