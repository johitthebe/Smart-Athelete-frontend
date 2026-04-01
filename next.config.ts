import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy ALL /api/* requests to Django backend
      // Destinations include trailing slash to match Django URL patterns
      {
        source: "/api/:path*/",
        destination: "http://localhost:8000/api/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*/",
      },
      // Proxy Google OAuth / allauth routes
      {
        source: "/accounts/:path*",
        destination: "http://localhost:8000/accounts/:path*",
      },
    ];
  },
  // Set false since we're handling trailing slashes in rewrites
  trailingSlash: false,
};

export default nextConfig;
