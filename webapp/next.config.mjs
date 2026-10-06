/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // El linting se omite durante el build de este sprint de demo (ver odd/tasks/portal-mvp.md).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
