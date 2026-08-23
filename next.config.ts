import type { NextConfig } from 'next';

const developmentScriptPolicy = process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'";

const securityHeaders = [
  { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline'${developmentScriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; upgrade-insecure-requests` },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
