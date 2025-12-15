import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../api/axios'

interface LoginPayload {
  login: string
  password: string
}

interface User {
  id_user: number
  login: string
  is_admin: boolean
}

interface AuthState {
  token: string | null
  user: User | null
  isAuth: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  isAuth: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload) => {
    const res = await api.post('/login', payload)
    return res.data
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await api.post('/api/auth/logout')
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuth = true

        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginThunk.rejected, state => {
        state.loading = false
        state.error = 'Неверный логин или пароль'
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.token = null
        state.user = null
        state.isAuth = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
  },
})

interface RegisterPayload {
  login: string;
  password: string;
}

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await api.post('/users', payload);
      return res.data; // вернёт DTO_Resp_User
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Ошибка регистрации');
    }
  }
);

export default authSlice.reducer
