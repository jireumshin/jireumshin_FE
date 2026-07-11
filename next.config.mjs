/** @type {import('next').NextConfig} */
const nextConfig = {
  // S3 + CloudFront 정적 호스팅용 정적 export
  output: 'export',
  // 각 경로를 folder/index.html 로 생성 → S3 정적 호스팅 라우팅과 호환
  trailingSlash: true,

  turbopack: {
    root: process.cwd(),
  },

  images: {
    // 정적 export는 서버 이미지 최적화 불가 → 끔
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 정적 export는 next의 headers()를 못 씀 → Permissions-Policy는 CloudFront 응답 헤더 정책으로 이관 예정
}

export default nextConfig
