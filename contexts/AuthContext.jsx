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
  requestPasswordReset,
  resetPassword,
} from "@/stores/authSlice";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const initialized = useSelector(selectors.getAuthInitialized);

  useEffect(() => {
    if (!initialized) dispatch(fetchMe());
  }, [dispatch, initialized]);

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
