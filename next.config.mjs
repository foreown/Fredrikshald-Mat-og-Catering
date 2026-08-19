/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Linting kjøres bevisst utenfor build (`npm run lint`) slik at en
  // stilistisk lint-regel aldri kan blokkere en produksjonsdeploy på Vercel.
  // TypeScript-feil blokkerer fortsatt buildet — det er med vilje.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // Bilder ligger i Supabase Storage. Standard Supabase-prosjekter bruker
    // <prosjekt-ref>.supabase.co. Bruker du eget domene for Supabase må du
    // legge det til her.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
