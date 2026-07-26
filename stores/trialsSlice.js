import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createApiClient, handleApiError } from "@/lib/api";

export const createTrial = createAsyncThunk(
  "trials/createTrial",
  async (data, { rejectWithValue }) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.post("/trials", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 사건 단건 조회 (결과 화면 진입·공유 링크)
export const fetchTrial = createAsyncThunk(
  "trials/fetchTrial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().get(`/trials/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 내 판례 목록 (최신순, 로그인 필요)
export const fetchMyTrials = createAsyncThunk(
  "trials/fetchMyTrials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await createApiClient().get("/trials/mine");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 심리 실행 → 판결 (멱등: 이미 판결난 사건은 그대로 반환)
export const requestVerdict = createAsyncThunk(
  "trials/requestVerdict",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/verdict`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

const initialState = {
  creating: false,
  error: null,
  lastCreated: null,
  current: null, // 결과 화면에서 보는 사건
  mine: [], // 내 판례 목록
  mineLoading: false,
};

const trialsSlice = createSlice({
  name: "trials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTrial.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTrial.fulfilled, (state, action) => {
        state.creating = false;
        state.lastCreated = action.payload;
      })
      .addCase(createTrial.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload ?? action.error?.message ?? "요청 실패";
      })
      .addCase(fetchTrial.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(requestVerdict.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchMyTrials.pending, (state) => {
        state.mineLoading = true;
      })
      .addCase(fetchMyTrials.fulfilled, (state, action) => {
        state.mineLoading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyTrials.rejected, (state) => {
        state.mineLoading = false;
      });
  },
});

export default trialsSlice.reducer;
