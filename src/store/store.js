import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingsReducer from './slices/bookingsSlice';
import sessionsReducer from './slices/sessionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingsReducer,
    sessions: sessionsReducer,
    ui: uiReducer,
  },
});

export default store;
