"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "@/stores";
import {
  fetchMe,
  login,
  signup,
  logout,
  updateNickname,
  requestPasswordReset,
  resetPassword,
} from "@/stores/authSlice";
import { claimAllPending } from "@/lib/pendingClaim";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const initialized = useSelector(selectors.getAuthInitialized);
  const user = useSelector(selectors.getUser);

  useEffect(() => {
    if (!initialized) dispatch(fetchMe());
  }, [dispatch, initialized]);

  // 로그인되면(카카오/일반 무관) 저장 표시해둔 익명 판례를 본인 것으로 귀속
  useEffect(() => {
    if (initialized && user) claimAllPending(dispatch);
  }, [initialized, user, dispatch]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(selectors.getUser);
  const status = useSelector(selectors.getAuthStatus);
  const error = useSelector(selectors.getAuthError);
  const initialized = useSelector(selectors.getAuthInitialized);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: status === "loading",
    initialized,
    error,
    login: (credentials) => dispatch(login(credentials)).unwrap(),
    signup: (data) => dispatch(signup(data)).unwrap(),
    logout: () => dispatch(logout()).unwrap(),
    updateNickname: (nickname) => dispatch(updateNickname(nickname)).unwrap(),
    requestPasswordReset: (email) =>
      dispatch(requestPasswordReset(email)).unwrap(),
    resetPassword: (payload) => dispatch(resetPassword(payload)).unwrap(),
    requireAuth: (redirectTo = "/login") => {
      if (initialized && user === null) {
        router.replace(redirectTo);
        return false;
      }
      return user !== null;
    },
  };
}
