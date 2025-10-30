import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://59e21e28e042a3d802c2d62579567af2@o4507355176960000.ingest.us.sentry.io/4510280144715776",

  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
