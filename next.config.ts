import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HF_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN || "",
  },
  /* config options here */
  // reactCompiler: true,
};

export default nextConfig;
