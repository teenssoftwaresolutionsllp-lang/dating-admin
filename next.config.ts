import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cpus: 1,
    agentUpgrade: "security" as any,
  },
};

export default nextConfig;
