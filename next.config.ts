import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/ja", permanent: false }];
  },
};

export default nextConfig;
