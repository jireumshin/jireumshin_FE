"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import { Spinner } from "@/components/ui/spinner";

export default function Layout({
  children,
  isLoading = false,
  showHeader = true,
  showBottomNavigation = false,
  allowScroll = true,
  noScroll = false,
  maxWidth = "430px", // 모바일 전용: 'full' | '390px' | '430px' | '480px'
}) {
  const scrollContainerRef = useRef(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(isLoading ? 1 : 0);
  const [wasLoading, setWasLoading] = useState(isLoading);

  // 초기 로딩 상태 관리
  useEffect(() => {
    // 컴포넌트가 마운트되고 첫 렌더링이 완료되면 초기 로딩 해제
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 100); // 짧은 딜레이로 레이아웃이 안정화될 때까지 대기

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setOverlayOpacity(1);
      setWasLoading(true);
    } else if (wasLoading) {
      setOverlayOpacity(0);
      setWasLoading(false);
    }
  }, [isLoading, wasLoading]);

  // 초기 로딩 또는 prop으로 전달된 로딩 상태
  const showLoadingOverlay = isInitialLoading || isLoading;
  const currentOpacity = showLoadingOverlay ? 1 : overlayOpacity;

  // maxWidth에 따른 클래스 설정 (모바일 전용: 태블릿/데스크탑으로 커지지 않음)
  const getMaxWidthClass = () => {
    if (maxWidth === "full") return "max-w-full";
    if (maxWidth === "390px") return "max-w-full sm:max-w-[390px]";
    if (maxWidth === "430px") return "max-w-full sm:max-w-[430px]";
    if (maxWidth === "480px") return "max-w-full sm:max-w-[480px]";
    return "max-w-full sm:max-w-[430px]"; // 기본값
  };

  return (
    <Card className="h-svh bg-gray-50 flex items-center justify-center overflow-hidden rounded-none">
      <Card
        className={`w-full ${getMaxWidthClass()} h-svh shadow-2xl flex flex-col bg-white overflow-hidden relative rounded-none`}
      >
        {showHeader && (
          <div className="shrink-0">
            <Header />
          </div>
        )}

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <CardContent
          ref={scrollContainerRef}
          className={`flex-1 min-h-0 overflow-x-hidden ${
            noScroll
              ? "overflow-y-hidden"
              : allowScroll
                ? "overflow-y-auto scrollbar-hide"
                : "overflow-y-hidden"
          }`}
        >
          {children}
        </CardContent>

        {showBottomNavigation && (
          <div className="shrink-0 border-t">
            {/* BottomNavigation 컴포넌트를 여기에 추가하세요 */}
            <div className="h-16 flex items-center justify-center">
              Bottom Navigation
            </div>
          </div>
        )}

        {/* 로딩 오버레이 */}
        {showLoadingOverlay && (
          <div
            className={`absolute inset-0 bg-white z-50 flex items-center justify-center ${
              showLoadingOverlay
                ? ""
                : "transition-opacity duration-500 ease-out"
            }`}
            style={{
              opacity: currentOpacity,
              pointerEvents: currentOpacity > 0 ? "auto" : "none",
            }}
          >
            <div className="text-center">
              <Spinner className="size-12 text-gray-900" />
            </div>
          </div>
        )}
      </Card>
    </Card>
  );
}
