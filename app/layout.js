import "./globals.css";
import { ReduxProvider } from "@/stores";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export const metadata = {
  title: "지름신 재판소",
  description:
    "충동구매를 재판에 회부하고, AI 배심원들과 싸워 판결을 받아내는 서비스",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
