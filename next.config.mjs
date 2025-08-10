/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Run ESLint during builds; fail on errors for stricter quality
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail the build on type errors
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig