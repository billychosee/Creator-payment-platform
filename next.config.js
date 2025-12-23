/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-src 'none';",
  },

  experimental: {
    optimizeCss: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Security Headers Configuration
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";
    const csp = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' data: https: blob:;
      font-src 'self' https: data:;
      connect-src 'self' https: wss:;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Feature Policy / Permissions Policy
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), payment=()",
          },
          // HSTS (HTTP Strict Transport Security)
          ...(isProduction
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          // Cache Control for sensitive pages
          {
            key: "Cache-Control",
            value: isProduction
              ? "no-cache, no-store, must-revalidate, private"
              : "no-cache",
          },
          // Remove server information
          {
            key: "X-Powered-By",
            value: "", // Remove Next.js version info
          },
          // Remove X-DNS-Prefetch-Control for security
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
      {
        // Additional headers for API routes
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_API_URL || "https://your-domain.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
          // CORS preflight cache
          {
            key: "Access-Control-Expose-Headers",
            value: "X-CSRF-Token, X-RateLimit-Limit, X-RateLimit-Remaining",
          },
        ],
      },
    ];
  },

  // Turbopack/Webpack configuration for security
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Remove webpack resolve alias warnings in production
    if (isServer) {
      config.externals = [...(config.externals || []), "canvas", "jsdom"];
    }

    // Add security-related plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.SECURE_MODE": JSON.stringify(
          process.env.NODE_ENV === "production"
        ),
      })
    );

    return config;
  },

  // Turbopack specific configuration
  turbopack: {},
};

module.exports = nextConfig;
