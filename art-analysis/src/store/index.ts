import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';
import authReducer from './authSlice';
import draftReducer from './draftSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;