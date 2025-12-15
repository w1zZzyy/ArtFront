import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import authReducer from './authSlice';
import requestReducer from './requestSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    request: requestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;