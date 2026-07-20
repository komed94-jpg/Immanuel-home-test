import type { NextConfig } from "next";

const deployedAt = process.env.NEXT_PUBLIC_DEPLOYED_AT || new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOYED_AT: deployedAt,
  },
};

export default nextConfig;
