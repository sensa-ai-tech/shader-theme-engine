import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@shader-theme/core'],
  output: 'export',
};

export default nextConfig;
