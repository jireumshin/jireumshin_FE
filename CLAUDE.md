# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 따르는 기본 아키텍처 규칙입니다.

## 프로젝트 개요
- Next.js 16 (App Router) + React 19 기반 프로젝트
- **JavaScript (JSX) 기반 프로젝트** (TypeScript 미사용)
- 컴포넌트 파일 확장자: `.jsx` 사용
- Redux Toolkit을 사용한 상태 관리
- Tailwind CSS 4 + shadcn/ui를 사용한 스타일링
- 모바일 전용 반응형 웹 애플리케이션

## 코딩 스타일 및 컨벤션

### 파일 명명 규칙
- 컴포넌트: PascalCase + `.jsx` 확장자 (예: `MyComponent.jsx`)
- 유틸리티/훅: camelCase + `.js` 확장자 (예: `useAuth.js`, `utils.js`)
- 페이지: Next.js App Router 규칙 따름 (`page.js`, `layout.js`)
- Redux Slice: camelCase + `Slice` 접미사 + `.js` 확장자 (예: `authSlice.js`)
- **주의**: 모든 컴포넌트는 반드시 `.jsx` 확장자 사용 (TypeScript `.tsx` 사용 안 함)

### 컴포넌트 작성 규칙
- 클라이언트 컴포넌트는 반드시 `'use client'` 지시어 사용
- 컴포넌트는 기본적으로 함수형 컴포넌트 사용
- Props는 구조 분해 할당 사용
- `cn()` 유틸리티로 클래스명 병합

```javascript
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function MyComponent({ className, children }) {
  const [state, setState] = useState(null)
  
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

### 상태 관리 규칙
- 전역 상태: Redux Toolkit 사용
- 로컬 UI 상태: useState 사용
- 서버 상태: Redux async thunk 또는 React Query 고려
- Redux Slice는 `createSlice` 사용
- Selector는 `src/stores/index.js`의 `selectors` 객체에 정의

### API 호출 규칙
- 모든 API 호출은 `src/lib/api.js`의 `createApiClient()` 사용
- `createApiClient()`는 axios 인스턴스를 반환하며, axios의 메서드(`get`, `post`, `put`, `delete` 등) 사용
- Redux async thunk에서 API 호출 수행
- 에러는 `handleApiError()`로 처리
- 토큰은 자동으로 주입되므로 수동 추가 불필요

```javascript
import { createApiClient, handleApiError } from '@/lib/api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchData = createAsyncThunk(
  'feature/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const apiClient = createApiClient()
      // axios 메서드 사용: get, post, put, delete, patch 등
      const response = await apiClient.get('/api/endpoint', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)

// POST 예시
export const createData = createAsyncThunk(
  'feature/createData',
  async (data, { rejectWithValue }) => {
    try {
      const apiClient = createApiClient()
      const response = await apiClient.post('/api/endpoint', data)
      return response.data
    } catch (error) {
      return rejectWithValue(handleApiError(error))
    }
  }
)
```

### 스타일링 규칙
- Tailwind CSS 클래스 우선 사용
- 커스텀 스타일은 `globals.css`에 추가
- 컴포넌트별 스타일은 Tailwind 클래스로 처리
- 반응형: 모바일 우선 (mobile-first)
- `cn()` 함수로 조건부 클래스 병합

### 레이아웃(모바일 전용)
- 화면 셸은 `components/common/Layout.jsx` 사용 — 데스크탑에서도 중앙 모바일 프레임으로 렌더링
- 기본 `maxWidth`는 `430px` (모바일 전용, 태블릿/데스크탑으로 넓어지지 않음)
- 옵션값: `'full' | '390px' | '430px' | '480px'`

### 인증 및 라우트 보호
- 인증이 필요한 페이지는 `useAuth()` 훅의 `requireAuth()` 사용
- 인증 상태는 Redux의 `auth` slice에서 관리
- `RouteAuthChecker` 컴포넌트로 자동 라우트 보호
- 인증 모달은 `AuthContext`에서 자동 관리

### 파일 구조 규칙
- 컴포넌트는 기능별로 폴더 분리
  - `common/`: 공통 컴포넌트
  - `dialog/`: 모달 컴포넌트
  - `ui/`: shadcn/ui 컴포넌트
  - `widgets/`: 복합 위젯 컴포넌트
- 각 기능 폴더 내부에 `hooks/` 폴더로 관련 훅 분리 가능
- **이미지 및 정적 자산 파일**: `assets/` 폴더에 저장
  - 이미지 파일은 우선적으로 `.svg` 확장자 사용 (`.png`, `.jpg` 등은 필요한 경우에만 사용)
  - SVG 파일은 `import` 문으로 직접 import하여 사용
  - Next.js Image 컴포넌트와 함께 사용 가능
- **아이콘**: 통일성을 위해 `lucide-react` 라이브러리의 아이콘 사용
  - 다른 아이콘 라이브러리나 커스텀 SVG 아이콘 사용 금지
  - `import { IconName } from 'lucide-react'` 형태로 import하여 사용

### Import 순서
1. React 및 Next.js 관련
2. 외부 라이브러리
3. 내부 컴포넌트 (절대 경로 `@/` 사용)
4. 유틸리티 및 훅
5. 상대 경로 import

```javascript
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import Layout from '@/components/common/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { selectors } from '@/stores'
import { cn } from '@/lib/utils'
```

### 에러 처리
- API 에러는 `handleApiError()` 사용
- 사용자에게 표시할 에러는 `toast.error()` 사용
- 개발 환경에서만 console.error 사용
- 에러 메시지는 한국어로 작성

### 성능 최적화
- 불필요한 리렌더링 방지: React.memo, useMemo, useCallback 적절히 사용
- 이미지는 Next.js Image 컴포넌트 사용 (필요시)
- 동적 import로 코드 스플리팅
- 큰 리스트는 가상화 고려

### 접근성
- 시맨틱 HTML 태그 사용
- ARIA 속성 적절히 활용
- 키보드 네비게이션 지원
- 색상 대비 비율 준수

### 모바일 최적화
- `100svh` 사용 (모바일 주소창 대응)
- 터치 이벤트 최적화
- 스크롤 성능 고려
- 모바일 브라우저 특성 고려 (iOS Safari, Android Chrome)

## 금지 사항

### 절대 하지 말아야 할 것들
- `console.log` 프로덕션 코드에 남기기
- 하드코딩된 API URL
- 인라인 스타일 남용
- `useEffect` 의존성 배열 누락
- Redux에서 비직렬화 가능한 값 저장 (함수, 클래스 인스턴스 등)
- `window`, `document` 직접 접근 시 SSR 체크 누락
- TypeScript 문법 사용 (이 프로젝트는 JavaScript/JSX 기반)

### 피해야 할 패턴
- Props drilling (Context나 Redux 사용 고려)
- 불필요한 전역 상태 (로컬 상태로 충분한 경우)
- 동기적 API 호출 (async/await 사용)
- 인라인 함수를 자식 컴포넌트에 전달 (useCallback 고려)

## 코드 리뷰 체크리스트

### 컴포넌트
- [ ] `'use client'` 지시어 올바르게 사용
- [ ] 파일 확장자 `.jsx` 사용 (컴포넌트)
- [ ] 불필요한 리렌더링 방지
- [ ] 접근성 고려
- [ ] 에러 처리 구현

### Redux
- [ ] Slice 이름 일관성 유지
- [ ] Selector는 `selectors` 객체에 정의
- [ ] Async thunk 에러 처리
- [ ] 불변성 유지

### API
- [ ] `createApiClient()` 사용
- [ ] 에러 처리 (`handleApiError`)
- [ ] 로딩 상태 관리
- [ ] 토큰 자동 주입 확인

### 스타일
- [ ] Tailwind 클래스 사용
- [ ] 반응형 디자인 적용
- [ ] 모바일 최적화 확인
- [ ] 접근성 (색상 대비 등)

## 자주 사용하는 패턴

### 페이지 컴포넌트
```javascript
'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '@/components/common/Layout'
import { fetchData } from '@/stores/featureSlice'
import { selectors } from '@/stores'

export default function MyPage() {
  const dispatch = useDispatch()
  const data = useSelector(selectors.getFeatureData)
  const loading = useSelector(selectors.getFeatureLoading)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return (
    <Layout allowScroll={true}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{/* 내용 */}</div>
      )}
    </Layout>
  )
}
```

### 커스텀 훅
```javascript
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectors } from '@/stores'
import { fetchData } from '@/stores/featureSlice'

export function useFeatureData() {
  const dispatch = useDispatch()
  const data = useSelector(selectors.getFeatureData)
  const loading = useSelector(selectors.getFeatureLoading)
  const error = useSelector(selectors.getFeatureError)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return { data, loading, error }
}
```

### 모달 컴포넌트
```javascript
'use client'

import { BaseModal } from '@/components/common/BaseModal'

export default function MyModal({ isOpen, onClose, children }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {children}
    </BaseModal>
  )
}
```

### SVG 이미지 사용
```javascript
'use client'

import Icon from '@/assets/icon.svg'

export default function MyComponent() {
  return (
    <img 
      src={Icon.src || Icon} 
      alt="Icon" 
      className="h-8 w-auto"
    />
  )
}
```

### 아이콘 사용
```javascript
'use client'

import { Home, User, Settings } from 'lucide-react'

export default function MyComponent() {
  return (
    <div className="flex gap-4">
      <Home className="h-5 w-5" />
      <User className="h-5 w-5" />
      <Settings className="h-5 w-5" />
    </div>
  )
}
```

## 환경 변수 사용
- 모든 환경 변수는 `NEXT_PUBLIC_` 접두사 사용
- 환경 변수는 단일 `.env` 파일에서 관리 (로컬 오버라이드가 필요하면 `.env.local` 사용 — git 무시됨)
- 환경 변수는 `process.env.NEXT_PUBLIC_*` 형태로 접근

## 디버깅
- 개발 환경에서만 console 사용
- Redux DevTools 활용
- React DevTools 활용
- 네트워크 탭에서 API 요청 확인
