// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
    HandlerDTOReqUserReg,
    HandlerDTOReqUserUpd,
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

// Thunk для получения текущего пользователя
export const getMeThunk = createAsyncThunk<
  HandlerDTORespUser,
  void,
  { rejectValue: string }
>('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    console.log('GET ME THUNK: fetching current user');
    const res = await api.api.usersMeList();
    console.log('GET ME THUNK: response data', res.data);
    if (res.data) {
      localStorage.setItem('userInfo', JSON.stringify(res.data));
    }
    return res.data;
  } catch (err: any) {
    console.error('GET ME THUNK ERROR', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message || 'Ошибка получения данных пользователя');
  }
});

// Thunk для обновления данных пользователя (пароль)
export const updateMeThunk = createAsyncThunk<
  HandlerDTORespUser,
  HandlerDTOReqUserUpd,
  { rejectValue: string }
>('auth/updateMe', async (payload, { rejectWithValue }) => {
  try {
    console.log('UPDATE ME THUNK: payload', payload);
    const res = await api.api.usersMeUpdate(payload);
    console.log('UPDATE ME THUNK: response data', res.data);
    if (res.data) {
      localStorage.setItem('userInfo', JSON.stringify(res.data));
    }
    return res.data;
  } catch (err: any) {
    console.error('UPDATE ME THUNK ERROR', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message || 'Ошибка обновления данных пользователя');
  }
});

// Thunk для выхода
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    console.log('LOGOUT THUNK: sending logout request');
    await api.api.authLogoutCreate();
    console.log('LOGOUT THUNK: logout request sent');
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
      // Login cases
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
      // Register cases
      .addCase(registerThunk.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
        console.log('REGISTER PENDING: state', state);
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespUser>) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
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
      // Get Me cases
      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('GET ME PENDING: state', state);
      })
      .addCase(getMeThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        console.log('GET ME FULFILLED: state', state);
      })
      .addCase(getMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения данных пользователя';
        console.log('GET ME REJECTED: state', state);
      })
      // Update Me cases
      .addCase(updateMeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('UPDATE ME PENDING: state', state);
      })
      .addCase(updateMeThunk.fulfilled, (state, action: PayloadAction<HandlerDTORespUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        console.log('UPDATE ME FULFILLED: state', state);
      })
      .addCase(updateMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка обновления данных пользователя';
        console.log('UPDATE ME REJECTED: state', state);
      })
      // Logout case
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
