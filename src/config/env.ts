const DEFAULT_SESSION_IDLE_TIMEOUT = 3600;

/** Seconds without user activity after which the login session expires (SESSION_IDLE_TIMEOUT, default 3600). */
const parseSessionIdleTimeout = (value: string | undefined): number => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return DEFAULT_SESSION_IDLE_TIMEOUT;
  }

  const seconds = Number(trimmed);
  if (/^\d+$/.test(trimmed) && Number.isSafeInteger(seconds) && seconds > 0) {
    return seconds;
  }

  console.warn(`Invalid SESSION_IDLE_TIMEOUT "${value}": expected a positive integer (seconds). Using the default of ${DEFAULT_SESSION_IDLE_TIMEOUT}.`);
  return DEFAULT_SESSION_IDLE_TIMEOUT;
};

// Server-side only: read at runtime, so the values can be changed in the container without rebuilding the image.
export const environment = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  hawkbitApiUrl: process.env.HAWKBIT_API_URL,
  sessionIdleTimeout: parseSessionIdleTimeout(process.env.SESSION_IDLE_TIMEOUT),
};
