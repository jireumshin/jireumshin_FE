"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import trialsReducer from "./trialsSlice";
import authReducer from "./authSlice";

const rootReducer = combineReducers({
  trials: trialsReducer,
  auth: authReducer,
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
  getCurrentTrial: (state) => state.trials.current,
  getMyTrials: (state) => state.trials.mine,
  getMyTrialsLoading: (state) => state.trials.mineLoading,
  // auth
  getUser: (state) => state.auth.user,
  getIsAuthenticated: (state) => state.auth.user !== null,
  getAuthStatus: (state) => state.auth.status,
  getAuthError: (state) => state.auth.error,
  getAuthInitialized: (state) => state.auth.initialized,
};

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
