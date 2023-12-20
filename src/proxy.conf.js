const PROXY_CONFIG = [
  {
    context: [
      "/auth-service",
      "/aws-service",
      "/orch-service",
      "/vrnaflow",
      "/intelligence-service",
      "/content-service",
      "/watchlist-service",
      "/support-service",
      "/payment-service",
      "/common-service",
      "/subscription-service",
      "/images"
    ],
    target: "https://dev.vrnaplex.com",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  {
    context: [      
      "/video",      
    ],
    target: "https://video.vrnaplex.com",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
  {
    context: [      
      "/trailer",
    ],
    target: "https://media.vrnaplex.com",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
