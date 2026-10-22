import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApiClient, handleApiError } from "@/lib/api";

// 서버가 내려주는 선택지 목록 (프로필 캐릭터 등)
export const fetchOptions = createAsyncThunk(
  "options/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await createApiClient().get("/options");
      return res.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
  // 여러 컴포넌트가 동시에 불러도 요청은 한 번만
  { condition: (_, { getState }) => !getState().options.loaded && !getState().options.loading },
);

const optionsSlice = createSlice({
  name: "options",
  initialState: { avatars: [], loaded: false, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.avatars = action.payload.avatars ?? [];
        state.loaded = true;
        state.loading = false;
      })
      .addCase(fetchOptions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default optionsSlice.reducer;
