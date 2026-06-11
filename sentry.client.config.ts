import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://bd60fdb7ff150fb99f26c312653f3ddb@o4509020866215936.ingest.de.sentry.io/4511500013404240",

  // Capture 100% of errors, but only 10% of performance traces in prod
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Session replay: record what the user was doing when an error occurred
  replaysOnErrorSampleRate: 1.0,   // always replay on error
  replaysSessionSampleRate: 0.05,  // sample 5% of normal sessions

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  enableLogs: true,
  sendDefaultPii: true,

  // Ignore noisy browser extension / network errors
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    "ChunkLoadError",
  ],
});
