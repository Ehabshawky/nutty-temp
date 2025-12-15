/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", 

  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // Internationalization handled via i18n in the app (react-i18next)
  // Allow local dev origin (e.g. 192.168.3.70) to request /_next/* resources
  // This avoids the cross-origin dev-server warning during development.
  // Note: `allowedDevOrigins` is a top-level option (not under `experimental`).
  allowedDevOrigins: [
    // include both with and without port if you access the site in different ways
    "http://192.168.3.70",
    "http://192.168.3.70:3000",
  ],
};

module.exports = nextConfig;
