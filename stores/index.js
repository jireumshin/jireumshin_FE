"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import trialsReducer from "./trialsSlice";

const rootReducer = combineReducers({
  trials: trialsReducer,
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

// Selector 모음 — 슬라이스 추가 시 여기에 정의
export const selectors = {
  getTrialCreating: (state) => state.trials.creating,
  getTrialError: (state) => state.trials.error,
  getLastCreatedTrial: (state) => state.trials.lastCreated,
};

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
