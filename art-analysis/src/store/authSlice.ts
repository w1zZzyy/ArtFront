// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
    HandlerDTOReqUserReg, 
    HandlerDTORespTokenLogin, 
    HandlerDTORespUser 
} from '../api/generated/api';
import { api } from '../api';

export interface AuthState {
  isAuth: boolean;
  user: HandlerDTORespUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: AuthState = {
  isAuth: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
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
    console.log('LOGIN THUNK: payload', payload);
    const res = await api.login.loginCreate(payload);
    const data = res.data;
    console.log('LOGIN THUNK: response data', data);

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      console.log('LOGIN THUNK: token saved to localStorage', data.token);
    }
    if (data.user) {
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      console.log('LOGIN THUNK: user saved to localStorage', data.user);
    }

    return data;
  } catch (err: any) {
    console.error('LOGIN THUNK ERROR', err.response?.data || err.message);
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
    console.log('REGISTER THUNK: payload', payload);
    const res = await api.users.usersCreate(payload);
    console.log('REGISTER THUNK: response data', res.data);
    return res.data;
  } catch (err: any) {
    console.error('REGISTER THUNK ERROR', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message || 'Ошибка регистрации');
  }
});

// Thunk для выхода
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    const token = localStorage.getItem('authToken');
    console.log('LOGOUT THUNK: token from localStorage', token);
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await (api.api.authLogoutCreate as any)(config);
      console.log('LOGOUT THUNK: logout request sent');
    }
  } catch (err) {
    console.error('LOGOUT THUNK ERROR:', err);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    console.log('LOGOUT THUNK: localStorage cleared');
  }
});

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
        console.log('LOGIN PENDING: state', state);
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespTokenLogin>) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        console.log('LOGIN FULFILLED: state', state);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Ошибка авторизации';
        console.log('LOGIN REJECTED: state', state);
      })
      .addCase(registerThunk.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
        console.log('REGISTER PENDING: state', state);
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespUser>) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken'); // может быть null
        state.error = null;
        console.log('REGISTER FULFILLED: state', state);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Ошибка регистрации';
        console.log('REGISTER REJECTED: state', state);
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.token = null;
        state.error = null;
        console.log('LOGOUT FULFILLED: state', state);
      });
  },
});

export default authSlice.reducer;
