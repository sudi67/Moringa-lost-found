import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/itemsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import rewardReducer from './slices/rewardSlice';
import adminReducer from './slices/adminSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    ui: uiReducer,
    auth: authReducer,
    rewards: rewardReducer,
    admin: adminReducer,
    comments: commentReducer,
  },
});
