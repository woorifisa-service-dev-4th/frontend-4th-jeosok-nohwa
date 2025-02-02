/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Vercel 배포 중 ESLint 오류 무시
    },
    experimental: {
        optimizeCss: false, // CSS 최적화
    }
};

export default nextConfig;
