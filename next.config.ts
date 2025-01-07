/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML 내보내기
  // distDir: 'dist' 제거 - 기본값인 'out' 사용
  images: {
      unoptimized: true
  },
  assetPrefix: './',
  trailingSlash: true, // URL 끝에 슬래시 추가
}

module.exports = nextConfig