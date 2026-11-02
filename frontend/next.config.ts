import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Tree-shake barrel-file icon/chart libraries so only used icons/components
  // are bundled instead of the entire package.
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react", "recharts", "framer-motion"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
