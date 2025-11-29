// next.config.js - COMMONJS VERSION
/** @type {import('next').NextConfig} */

console.log('🔐 NEXT.CONFIG - process.env.STREAM_PUBLIC_ACCESS_PASSWORD:', process.env.STREAM_PUBLIC_ACCESS_PASSWORD)

const nextConfig = {
  env: {
    STREAM_PUBLIC_ACCESS_PASSWORD: process.env.STREAM_PUBLIC_ACCESS_PASSWORD,
  },
}

module.exports = nextConfig