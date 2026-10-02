import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  // Same-origin proxy so SESSION and XSRF-TOKEN cookies stay first-party.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
