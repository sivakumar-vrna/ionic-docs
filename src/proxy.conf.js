const PROXY_CONFIG = [
  {
    context: [
      "/auth-service",
      "/orch-service",
      "/vrnaflow",
      "/intelligence-service",
      "/content-service",
      "/watchlist-service",
      "/support-service",
      "/payment-service",
      "/common-service",
      "/subscription-service",
      "/images",
      "/video",
      "/trailer",
    ],
    target: "http://45.79.199.120:8089",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
