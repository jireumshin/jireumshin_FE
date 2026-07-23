import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApiClient } from "@/lib/api";

const extractMessage = (error, fallback) => {
  const m = error?.response?.data?.message;
  if (Array.isArray(m)) return m[0];
  return m || fallback;
};

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await createApiClient().get("/auth/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await createApiClient().post("/auth/login", credentials);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        extractMessage(error, "아이디 또는 비밀번호를 확인해주세요."),
      );
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createApiClient().post("/auth/signup", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(extractMessage(error, "회원가입에 실패했어요."));
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await createApiClient().post("/auth/logout");
  } catch {}
  return null;
});

// 비밀번호 재설정 요청 — 서버가 재설정 링크를 메일로 발송
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const res = await createApiClient().post("/auth/password/reset-request", {
        email,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(extractMessage(error, "요청에 실패했어요."));
    }
  },
);

// 토큰으로 새 비밀번호 설정
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await createApiClient().post("/auth/password/reset", {
        token,
        newPassword,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        extractMessage(error, "비밀번호 재설정에 실패했어요."),
      );
    }
  },
);

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' — 로그인/가입 제출 상태
  error: null,
  initialized: false, // 세션 복원(fetchMe) 완료 여부
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 세션 복원
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.initialized = true;
      })
      // 로그아웃
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // 로그인 / 회원가입 (둘 다 성공 시 로그인 상태)
      .addMatcher(
        (action) =>
          [login.pending.type, signup.pending.type].includes(action.type),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [login.fulfilled.type, signup.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = "idle";
          state.user = action.payload;
          state.initialized = true;
        },
      )
      .addMatcher(
        (action) =>
          [login.rejected.type, signup.rejected.type].includes(action.type),
        (state, action) => {
          state.status = "idle";
          state.error = action.payload;
        },
      );
  },
});

export default authSlice.reducer;
