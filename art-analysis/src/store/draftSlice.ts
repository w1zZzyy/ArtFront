import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import type { DraftTaskInfo } from '../types/types';

export const addExpertToDraft = createAsyncThunk(
  'draft/addExpert',
  async (id_artcenter: number) => {
    const res = await api.post(`/api/draft/experts/${id_artcenter}`);
    return res.data as DraftTaskInfo; // ожидаемый ответ от API
  }
);

interface DraftState {
  draftTask: DraftTaskInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: DraftState = {
  draftTask: null,
  loading: false,
  error: null,
};

export const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addExpertToDraft.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpertToDraft.fulfilled, (state, action: PayloadAction<DraftTaskInfo>) => {
        state.loading = false;
        state.draftTask = action.payload;
      })
      .addCase(addExpertToDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Не удалось добавить эксперта';
      });
  }
});

export default draftSlice.reducer;
