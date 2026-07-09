"use client";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { combineReducers } from "@reduxjs/toolkit";
import exampleReducer from "./exampleSlice";

const rootReducer = combineReducers({
  example: exampleReducer,
  // 여기에 다른 reducer들을 추가
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

// Selectors
export const selectors = {
  getExampleData: (state) => state.example.data,
  getExampleLoading: (state) => state.example.loading,
  getExampleError: (state) => state.example.error,
};

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
