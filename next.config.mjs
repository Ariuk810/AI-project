/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HF_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN || "",
  },
  // reactCompiler: true,
};

export default nextConfig;

