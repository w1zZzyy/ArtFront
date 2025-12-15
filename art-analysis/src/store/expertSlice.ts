import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  HandlerDTORespExpert,
  HandlerDTORespCurrCenterRequestInfo,
} from '../api/generated/api';

interface ExpertsState {
  data: HandlerDTORespExpert[];
  loading: boolean;
  error: string | null;
  draftRequest: HandlerDTORespCurrCenterRequestInfo | null;
  useMock: boolean;
}

const initialState: ExpertsState = {
  data: [],
  loading: false,
  error: null,
  draftRequest: null,
  useMock: false,
};

const expertsSlice = createSlice({
  name: 'experts',
  initialState,
  reducers: {
    setExperts: (state, action: PayloadAction<HandlerDTORespExpert[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDraftRequest: (
      state,
      action: PayloadAction<HandlerDTORespCurrCenterRequestInfo | null>
    ) => {
      state.draftRequest = action.payload;
    },
    setUseMock: (state, action: PayloadAction<boolean>) => {
      state.useMock = action.payload;
    },
    updateExpertsCount: (state, action: PayloadAction<number>) => {
      if (state.draftRequest) {
        state.draftRequest.experts_count = action.payload;
      }
    },
    incrementExpertsCount: (state) => {
      if (state.draftRequest && state.draftRequest.experts_count !== undefined) {
        state.draftRequest.experts_count += 1;
      }
    },
  },
});

export const {
  setExperts,
  setLoading,
  setError,
  setDraftRequest,
  setUseMock,
  updateExpertsCount,
  incrementExpertsCount,
} = expertsSlice.actions;

export default expertsSlice.reducer;
