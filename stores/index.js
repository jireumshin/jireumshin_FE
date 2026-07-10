"use client";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// 슬라이스가 생기면 여기서 등록 (예: combineReducers({ auth, trial }))
const rootReducer = (state = {}) => state;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

// Selector 모음 — 슬라이스 추가 시 여기에 정의
export const selectors = {};

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
