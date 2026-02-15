import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@shader-theme/core'],
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
