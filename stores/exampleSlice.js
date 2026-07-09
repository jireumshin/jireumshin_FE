"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApiClient } from "@/lib/api";

// 초기 상태
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// 비동기 액션 예제
export const fetchExampleData = createAsyncThunk(
  "example/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get("/example");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Slice 생성
const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    clearData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExampleData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExampleData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setData, clearData } = exampleSlice.actions;
export default exampleSlice.reducer;
