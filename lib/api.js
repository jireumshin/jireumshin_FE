import axios from "axios";
import { config } from "./config";

// API 환경변수 설정
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || config.apiUrl;

export const getApiUrl = () => {
  if (!API_BASE_URL) {
    return null;
  }
  return API_BASE_URL;
};

// ===== 쿠키 관리 함수 (선택사항) =====
// 쿠키를 사용하는 프로젝트의 경우 아래 주석을 해제하여 사용

/*
// 쿠키에서 값 가져오기
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// 쿠키 도메인 가져오기 (환경에 따라 자동 설정)
const getCookieDomain = () => {
  if (typeof window === 'undefined') return ''
  const hostname = window.location.hostname
  
  // localhost는 domain 설정 안 함
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return ''
  }
  
  // 필요에 따라 도메인 설정 로직 추가
  // 예: if (hostname.includes('example.com')) return ';domain=.example.com'
  
  return ''
}

// 쿠키 설정 함수
export const setCookie = (name, value, days = 7) => {
  if (typeof window === 'undefined') return
  const expires = new Date()
  // days가 null이거나 undefined면 무한대로 설정
  if (days === null || days === undefined) {
    expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000) // 100년 후
  } else {
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  }
  const domain = getCookieDomain()
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${domain}`
}

// 쿠키 삭제 함수
export const deleteCookie = (name) => {
  if (typeof window === 'undefined') return
  const domain = getCookieDomain()
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domain}`
}
*/

// axios 인스턴스 생성
export const createApiClient = (customBaseURL) => {
  const baseUrl = customBaseURL || getApiUrl();

  if (!baseUrl) {
    throw new Error(
      "API base URL이 설정되지 않았습니다. NEXT_PUBLIC_API_URL 환경변수를 설정하거나 baseURL을 파라미터로 전달하세요.",
    );
  }

  const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // 30초 타임아웃
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    withCredentials: true,
  });

  // 요청 인터셉터
  apiClient.interceptors.request.use(
    (config) => {
      // 여기에 공통 요청 로직 추가 가능
      // 예: 공통 헤더 추가, 로깅 등
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // 여기에 공통 에러 처리 로직 추가 가능
      // 예: 특정 에러 코드에 대한 공통 처리
      return Promise.reject(error);
    },
  );

  return apiClient;
};

// 공통 API 에러 처리 함수
export const handleApiError = (error) => {
  if (error.response) {
    // 서버가 응답했지만 에러 상태 코드
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    throw new Error(`API 요청 실패 (${status}): ${message}`);
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못함
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      throw new Error("요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("네트워크 오류: 서버에 연결할 수 없습니다.");
  } else {
    // 요청 설정 중 오류 발생
    throw new Error(`요청 설정 오류: ${error.message}`);
  }
};
