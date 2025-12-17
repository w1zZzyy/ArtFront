// src/store/slices/requestSlice.ts
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { api } from '../api/index';
import type {
  HandlerDTORespCenterRequest,
  HandlerDTORespCurrCenterRequestInfo,
  HandlerDTORespCenterRequestExpertLink, 
  HandlerDTORespUpdate
} from '../api/generated/api';
import { getArtExpertById } from '../api/expertsApi';
import type { IArtExpert } from '../types/types';

// --- State ---
interface RequestState {
  list: HandlerDTORespCenterRequest[];
  currentRequest: HandlerDTORespCenterRequest | null;
  currentDraftInfo: HandlerDTORespCurrCenterRequestInfo | null;
  loading: boolean;
  error: string | null;
  operationSuccess: boolean;
  addingExpert: number | null; // id эксперта, который добавляется
  expertsById: Record<number, IArtExpert>;
}

const initialState: RequestState = {
  list: [],
  currentRequest: null,
  currentDraftInfo: null,
  loading: false,
  error: null,
  operationSuccess: false,
  addingExpert: null,
  expertsById: {}
};

// --- Actions ---
export const setAddingExpert = createAction<number | null>('request/setAddingExpert');

// --- Thunks ---

// Получить список всех заявок
export const fetchRequestsList = createAsyncThunk<
  HandlerDTORespCenterRequest[],
  { status?: string; from?: string; to?: string; isModerator?: boolean; userId?: number } | undefined,
  { rejectValue: string }
>(
  'request/fetchList',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const query: any = {};
      if (filters.status && filters.status !== 'all') {
        query.status = filters.status;
      }
      if (filters.from) {
        query.from = filters.from;
      }
      if (filters.to) {
        query.to = filters.to;
      }
      console.log('fetchRequestsList: query =', query);
      console.log('fetchRequestsList: token =', localStorage.getItem('authToken'));
      const res = await api.api.centerRequestList(query);
      console.log('fetchRequestsList: response =', res.data);
      console.log('fetchRequestsList: full response =', res);
      
      let filteredData = res.data;
      
      // Фильтрация для модератора: показываем только заявки, где он модератор
      if (filters.isModerator && filters.userId) {
        filteredData = res.data.filter(request => request.id_moderator === filters.userId);
        console.log('fetchRequestsList: filtered for moderator =', filteredData);
      }
      
      return filteredData;
    } catch (err: any) {
      console.error('fetchRequestsList: error =', err);
      return rejectWithValue('Не удалось загрузить список заявок');
    }
  }
);

// Получить текущий черновик
export const fetchCurrentDraftInfo = createAsyncThunk(
  'request/fetchCurrentDraftInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return rejectWithValue('Нет токена авторизации');
      const res = await (api.api.centerRequestCurrentList as any)({
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось получить данные черновика');
    }
  }
);

// Получить полную текущую черновую заявку
export const fetchCurrentDraftRequest = createAsyncThunk(
  'request/fetchCurrentDraftRequest',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const info = await dispatch(fetchCurrentDraftInfo()).unwrap();
      if (!info.id_request) return null;
      const request = await dispatch(fetchRequestById(info.id_request)).unwrap();
      return request;
    } catch (err: any) {
      return rejectWithValue('Не удалось загрузить черновик');
    }
  }
);

// Получить заявку по ID
export const fetchRequestById = createAsyncThunk(
  'request/fetchById',
  async (id: number, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.api.centerRequestDetail(id);
    const request = res.data;

    // ЗАГРУЖАЕМ ЭКСПЕРТОВ
    request.experts?.forEach((link: any) => {
      if (link.id_artcenter) {
        dispatch(fetchExpertById(link.id_artcenter));
      }
    });

    return request;
  } catch {
    return rejectWithValue('Не удалось загрузить заявку');
  }
}
);



// Добавить эксперта в черновик
export const addExpertToDraft = createAsyncThunk(
  'request/addExpertToDraft',
  async (expertId: number, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAddingExpert(expertId));
      const token = localStorage.getItem('authToken');
      if (!token) return rejectWithValue('Нет токена авторизации');
      const res = await (api.api.draftExpertsCreate as any)(
        expertId,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchCurrentDraftInfo());
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось добавить эксперта');
    } finally {
      dispatch(setAddingExpert(null));
    }
  }
);

// Сформировать заявку
export const formRequest = createAsyncThunk(
  'request/form',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.api.centerRequestFormUpdate(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось сформировать заявку');
    }
  }
);

// Удалить заявку
export const deleteRequest = createAsyncThunk(
  'request/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.centerRequestDelete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue('Не удалось удалить заявку');
    }
  }
);

// Обновить описание заявки
export const updateRequestDescription = createAsyncThunk<
  HandlerDTORespCenterRequest,
  { id: number; description: string },
  { rejectValue: string }
>(
  'request/updateDescription',
  async ({ id, description }, { rejectWithValue }) => {
    try {
      const res = await api.api.centerRequestUpdate(id, {
        center_x: 0,
        center_y: 0,
        request_description: description,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось обновить описание заявки');
    }
  }
);

// Обновить координаты центра заявки
export const updateRequestCenter = createAsyncThunk<
  HandlerDTORespUpdate,
  { id: number; expertId: number; centerX: number; centerY: number; description?: string },
  { rejectValue: string }
>(
  'request/updateCenter',
  async ({ id, expertId, centerX, centerY, description }, { rejectWithValue }) => {
    try {
      const res = await api.api.centerRequestExpertsUpdate(id, expertId, {
        center_x: centerX,
        center_y: centerY,
        request_description: description ?? '',
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось обновить координаты центра');
    }
  }
);

// Удалить эксперта из заявки
export const removeExpertFromRequest = createAsyncThunk<
  HandlerDTORespCenterRequestExpertLink,
  { requestId: number; expertId: number },
  { rejectValue: string }
>(
  'request/removeExpert',
  async ({ requestId, expertId }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.api.centerRequestExpertsDelete(requestId, expertId);
      await dispatch(fetchRequestById(requestId));
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось удалить эксперта из заявки');
    }
  }
);

// Завершить или отклонить заявку
export const resolveRequest = createAsyncThunk<
  HandlerDTORespCenterRequest,
  { id: number; action: 'complete' | 'reject' },
  { rejectValue: string }
>(
  'request/resolve',
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const res = await api.api.centerRequestResolveUpdate(id, { action });
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось завершить или отклонить заявку');
    }
  }
);

export const fetchExpertById = createAsyncThunk<
  IArtExpert,
  number,
  { rejectValue: string }
>(
  'request/fetchExpertById',
  async (id, { rejectWithValue }) => {
    try {
      return await getArtExpertById(String(id));
    } catch {
      return rejectWithValue('Не удалось загрузить эксперта');
    }
  }
);

// Сохранить все координаты экспертов
export const saveExpertsCoordinates = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: { request: RequestState } }
>(
  'request/saveExpertsCoordinates',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const request = state.request.currentRequest;
      
      if (!request || !request.id_request || !request.experts) {
        return rejectWithValue('Нет активной заявки');
      }

      // Сохраняем координаты для каждого эксперта
      const promises = request.experts.map((expert) => {
        if (expert.id_artcenter && expert.id_request) {
          return dispatch(
            updateRequestCenter({
              id: expert.id_request,
              expertId: expert.id_artcenter,
              centerX: expert.center_x ?? 0,
              centerY: expert.center_y ?? 0,
              description: request.description ?? '',
            })
          ).unwrap();
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      
      // Перезагружаем заявку после сохранения
      await dispatch(fetchRequestById(request.id_request)).unwrap();
    } catch (err: any) {
      return rejectWithValue('Не удалось сохранить данные');
    }
  }
);

// --- Slice ---
const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    resetOperationSuccess: (state) => {
      state.operationSuccess = false;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.currentDraftInfo = null;
      state.error = null;
      state.loading = false;
    },
    setCurrentRequestField: (
      state,
      action: { payload: { field: string; value: any } }
    ) => {
      if (state.currentRequest) {
        const { field, value } = action.payload;
        if (field in state.currentRequest) {
          (state.currentRequest as any)[field] = value;
        }
      }
    },
    updateExpertLink: (
      state,
      action: { payload: { index: number; field: string; value: any } }
    ) => {
      if (state.currentRequest && state.currentRequest.experts) {
        const { index, field, value } = action.payload;
        if (index >= 0 && index < state.currentRequest.experts.length) {
          const expert = state.currentRequest.experts[index];
          if (field in expert) {
            (expert as any)[field] = value;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // fetchRequestsList
    builder
      .addCase(fetchRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchCurrentDraftInfo
    builder
      .addCase(fetchCurrentDraftInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentDraftInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDraftInfo = action.payload;
      })
      .addCase(fetchCurrentDraftInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpertById.fulfilled, (state, action) => {
        state.expertsById[action.payload.id_artcenter] = action.payload;
      });

    // fetchCurrentDraftRequest
    builder
      .addCase(fetchCurrentDraftRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentDraftRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchCurrentDraftRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchRequestById
    builder
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addExpertToDraft
    builder
      .addCase(addExpertToDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpertToDraft.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addExpertToDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // formRequest
    builder
      .addCase(formRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(formRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteRequest
    builder
      .addCase(deleteRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state) => {
        state.loading = false;
        state.currentRequest = null;
        state.currentDraftInfo = null;
        state.operationSuccess = true;
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- Новые thunk-ы ---
    // updateRequestDescription
    builder
      .addCase(updateRequestDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
        state.operationSuccess = true;
      })
      .addCase(updateRequestDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateRequestCenter
    builder
      .addCase(updateRequestCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestCenter.fulfilled, (state) => {
        state.loading = false;
        // Не присваиваем currentRequest напрямую, его обновит fetchRequestById
      })
      .addCase(updateRequestCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // removeExpertFromRequest
    builder
      .addCase(removeExpertFromRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeExpertFromRequest.fulfilled, (state) => {
        state.loading = false;
        state.operationSuccess = true;
      })
      .addCase(removeExpertFromRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // resolveRequest
    builder
      .addCase(resolveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
        state.operationSuccess = true;
      })
      .addCase(resolveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // setAddingExpert
    builder.addCase(setAddingExpert, (state, action) => {
      state.addingExpert = action.payload;
    });

    // saveExpertsCoordinates
    builder
      .addCase(saveExpertsCoordinates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveExpertsCoordinates.fulfilled, (state) => {
        state.loading = false;
        state.operationSuccess = true;
      })
      .addCase(saveExpertsCoordinates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOperationSuccess, clearCurrentRequest } = requestSlice.actions;
export default requestSlice.reducer;
