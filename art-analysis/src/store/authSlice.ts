// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Api, HandlerDTOReqUserReg, HandlerDTORespTokenLogin, HandlerDTORespUser } from '../api/generated/api';

const api = new Api(); // создаем экземпляр API-клиента

export interface AuthState {
  isAuth: boolean;
  user: HandlerDTORespUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Thunk для логина
export const loginThunk = createAsyncThunk<
  HandlerDTORespTokenLogin,
  HandlerDTOReqUserReg,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.login.loginCreate(payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message || 'Ошибка авторизации');
  }
});

// Thunk для регистрации
export const registerThunk = createAsyncThunk<
  HandlerDTORespUser,
  HandlerDTOReqUserReg,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.users.usersCreate(payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message || 'Ошибка регистрации');
  }
});

// Thunk для выхода
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await api.api.authLogoutCreate();
  } catch (err) {
    console.error('Ошибка выхода:', err);
  }
});

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespTokenLogin>) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Ошибка авторизации';
      })
      .addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespUser>) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.token = null;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Ошибка регистрации';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
