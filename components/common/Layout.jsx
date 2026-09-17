"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Loading from "./Loading";
import BottomTabBar from "./BottomTabBar";

export default function Layout({
  children,
  isLoading = false,
  showHeader = true,
  headerProps = {},
  showBottomNavigation = false,
  bottomNavigation = null,
  activeTab = null, // "home" | "feed" | "records" → 글로벌 하단 탭바 노출
  allowScroll = true,
  noScroll = false,
}) {
  const scrollContainerRef = useRef(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(isLoading ? 1 : 0);
  const [wasLoading, setWasLoading] = useState(isLoading);

  // 초기 렌더가 안정화될 때까지 짧게 로딩 오버레이 유지
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 100);
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

  const showLoadingOverlay = isInitialLoading || isLoading;
  const currentOpacity = showLoadingOverlay ? 1 : overlayOpacity;

  return (
    <div className="flex h-svh justify-center">
      <div className="relative flex h-svh w-full max-w-117 flex-col overflow-hidden border-x border-jj-line bg-jj-app">
        {showHeader && (
          <div className="shrink-0">
            <Header {...headerProps} />
          </div>
        )}

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <main
          ref={scrollContainerRef}
          className={`min-h-0 flex-1 overflow-x-hidden ${
            noScroll
              ? "overflow-y-hidden"
              : allowScroll
                ? "overflow-y-auto"
                : "overflow-y-hidden"
          }`}
        >
          {children}
        </main>

        {showBottomNavigation && (
          <div className="shrink-0 border-t border-jj-line bg-jj-paper">
            {bottomNavigation}
          </div>
        )}

        {activeTab && (
          <div className="relative z-20 shrink-0">
            <BottomTabBar active={activeTab} />
          </div>
        )}

        {/* 로딩 오버레이 */}
        {showLoadingOverlay && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center bg-jj-app ${
              showLoadingOverlay
                ? ""
                : "transition-opacity duration-500 ease-out"
            }`}
            style={{
              opacity: currentOpacity,
              pointerEvents: currentOpacity > 0 ? "auto" : "none",
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
