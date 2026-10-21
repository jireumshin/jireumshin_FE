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
);

const optionsSlice = createSlice({
  name: "options",
  initialState: { avatars: [], loaded: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptions.fulfilled, (state, action) => {
      state.avatars = action.payload.avatars ?? [];
      state.loaded = true;
    });
  },
});

export default optionsSlice.reducer;
