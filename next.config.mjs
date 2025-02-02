/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Vercel 배포 중 ESLint 오류 무시
    },
};

export default nextConfig;
