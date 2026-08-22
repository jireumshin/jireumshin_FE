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

// 상품 이미지 업로드 (BE 경유 S3) — imageUrl 반환. 기소 제출 전에 호출.
export const uploadTrialImage = createAsyncThunk(
  "trials/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const form = new FormData();
      form.append("file", file);

      const response = await createApiClient().post("/uploads/image", form, {
        headers: { "Content-Type": undefined },
      });
      return response.data.imageUrl;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 사건 단건 조회 (결과 화면 진입·공유 링크)
export const fetchTrial = createAsyncThunk(
  "trials/fetchTrial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().get(`/trials/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 내 판례 목록 (최신순, 로그인 필요)
export const fetchMyTrials = createAsyncThunk(
  "trials/fetchMyTrials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await createApiClient().get("/trials/mine");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 후회 재질문 응답 (본인 판례) — 갱신된 사건 반환
export const submitFollowUp = createAsyncThunk(
  "trials/submitFollowUp",
  async ({ id, purchased, regret }, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/follow-up`, {
        purchased,
        regret,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 심리 실행 → 판결 (멱등: 이미 판결난 사건은 그대로 반환)
export const requestVerdict = createAsyncThunk(
  "trials/requestVerdict",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/verdict`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 익명으로 기소한 판례를 로그인 유저 본인에게 저장(연결) — 갱신된 사건 반환
export const claimTrial = createAsyncThunk(
  "trials/claimTrial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/claim`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 배심원 변론 한 라운드 (판결 후 설득) — 갱신된 사건(게이지·표·메시지) 반환
export const submitDefense = createAsyncThunk(
  "trials/submitDefense",
  async ({ id, message, target }, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/defense`, {
        message,
        ...(target ? { target } : {}),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 공개된 판례 피드
export const fetchFeed = createAsyncThunk(
  "trials/fetchFeed",
  async (cursor, { rejectWithValue }) => {
    try {
      const response = await createApiClient().get("/trials/feed", {
        params: cursor ? { cursor } : {},
      });
      return { ...response.data, append: !!cursor };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 공감 토글 (로그인 필요)
export const toggleLike = createAsyncThunk(
  "trials/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/like`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

// 내 판례를 피드에 공개 / 공개 취소 — 갱신된 사건 반환
export const publishTrial = createAsyncThunk(
  "trials/publishTrial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().post(`/trials/${id}/publish`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  },
);

export const unpublishTrial = createAsyncThunk(
  "trials/unpublishTrial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await createApiClient().delete(`/trials/${id}/publish`);
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
  current: null, // 결과 화면에서 보는 사건
  mine: [], // 내 판례 목록
  mineLoading: false,
  feed: [], // 공개 판례 피드
  feedCursor: null, // 다음 페이지 커서 (null = 더 없음)
  feedLoading: false,
  feedLoaded: false,
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
      })
      .addCase(fetchTrial.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(requestVerdict.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchMyTrials.pending, (state) => {
        state.mineLoading = true;
      })
      .addCase(fetchMyTrials.fulfilled, (state, action) => {
        state.mineLoading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyTrials.rejected, (state) => {
        state.mineLoading = false;
      })
      .addCase(submitFollowUp.fulfilled, (state, action) => {
        const updated = action.payload;
        state.mine = state.mine.map((t) => (t.id === updated.id ? updated : t));
        if (state.current?.id === updated.id) state.current = updated;
      })
      .addCase(submitDefense.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.current?.id === updated.id) state.current = updated;
        state.mine = state.mine.map((t) => (t.id === updated.id ? updated : t));
      })
      .addCase(claimTrial.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.current?.id === updated.id) state.current = updated;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.feedLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { items, nextCursor, append } = action.payload;
        state.feedLoading = false;
        state.feedLoaded = true;
        state.feed = append ? [...state.feed, ...items] : items;
        state.feedCursor = nextCursor;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.feedLoading = false;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked, likeCount } = action.payload;
        const apply = (t) =>
          t && t.id === id ? { ...t, liked, likedByMe: liked, likeCount } : t;
        state.feed = state.feed.map(apply);
        if (state.current?.id === id) state.current = apply(state.current);
      })
      .addCase(publishTrial.fulfilled, (state, action) => {
        const updated = action.payload;
        state.mine = state.mine.map((t) => (t.id === updated.id ? updated : t));
        if (state.current?.id === updated.id) state.current = updated;
      })
      .addCase(unpublishTrial.fulfilled, (state, action) => {
        const updated = action.payload;
        state.mine = state.mine.map((t) => (t.id === updated.id ? updated : t));
        if (state.current?.id === updated.id) state.current = updated;
      });
  },
});

export default trialsSlice.reducer;
