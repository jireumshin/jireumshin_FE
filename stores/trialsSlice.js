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

const initialState = {
  creating: false,
  error: null,
  lastCreated: null,
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
      });
  },
});

export default trialsSlice.reducer;
