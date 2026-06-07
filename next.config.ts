import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bmw-m.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
