import { useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';

/**
 * Real user interactions. Background polling never fires them, so it cannot keep the session alive.
 * Scrolling is caught through wheel, touch, keyboard and scrollbar pointer events instead of the `scroll` event,
 * which also fires when the page scrolls by itself (for example when polled data changes the height of a table).
 */
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

const MAX_RENEW_INTERVAL_MS = 60_000;

/**
 * Keeps the session alive while the user is active: on activity it calls /api/auth/session, which re-issues the
 * session cookie with a new expiry. Without activity the session expires after `idleTimeoutSeconds`.
 */
export function useRefreshSessionOnActivity(idleTimeoutSeconds: number) {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    // At most once a minute, or every quarter of the timeout when the timeout is shorter than 4 minutes.
    const renewIntervalMs = Math.max(1_000, Math.min(MAX_RENEW_INTERVAL_MS, (idleTimeoutSeconds * 1_000) / 4));
    // 0: the first activity after a page load renews immediately, the cookie may be close to its expiry.
    let lastRenewAt = 0;
    let pendingRenew: ReturnType<typeof setTimeout> | undefined;

    const renew = () => {
      pendingRenew = undefined;
      lastRenewAt = Date.now();
      // If the session has already expired this returns null: the next hawkBit request gets a 401 and
      // the axios interceptor sends the user to the login page.
      void getSession({ broadcast: false });
    };

    const onActivity = () => {
      if (pendingRenew) {
        return;
      }
      const wait = lastRenewAt + renewIntervalMs - Date.now();
      if (wait <= 0) {
        renew();
      } else {
        // Renew at the end of the interval, so the session never expires earlier than idleTimeoutSeconds
        // after the last activity.
        pendingRenew = setTimeout(renew, wait);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onActivity();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, onActivity, { capture: true, passive: true }));
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onActivity, { capture: true }));
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(pendingRenew);
    };
  }, [status, idleTimeoutSeconds]);
}
