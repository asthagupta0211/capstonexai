import { env } from '../config/env.js';

/**
 * Keep-Alive Service for Render (and other free-tier platforms)
 * Render free web services spin down after 15 minutes of inactivity.
 * This service automatically sends an incoming HTTP GET request to Render's
 * external URL every 10 minutes to reset the inactivity timer and prevent sleep.
 */
export function initKeepAlive(): void {
  const targetUrl = env.RENDER_EXTERNAL_URL;

  if (!targetUrl) {
    console.log(
      'ℹ️  Keep-alive service: Idle (Set RENDER_EXTERNAL_URL or KEEP_ALIVE_URL in production to enable 10-minute self-ping).'
    );
    return;
  }

  const intervalMs = Math.max(env.KEEP_ALIVE_INTERVAL_MINUTES, 1) * 60 * 1000;
  const baseUrl = targetUrl.replace(/\/+$/, '');
  const pingUrl = `${baseUrl}/api/v1/health`;

  console.log(
    `⏱️  Keep-alive service active: Pinging ${pingUrl} every ${env.KEEP_ALIVE_INTERVAL_MINUTES} minutes to keep Render alive 24/7.`
  );

  // Initial ping 30 seconds after boot to ensure routes and networking are fully initialized
  setTimeout(() => {
    sendPing(pingUrl);
  }, 30 * 1000);

  // Periodic recurring ping
  setInterval(() => {
    sendPing(pingUrl);
  }, intervalMs);
}

async function sendPing(url: string): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Capstonex-KeepAlive/1.0',
        'X-Keep-Alive': 'true',
      },
    });

    if (response.ok) {
      console.log(
        `[${new Date().toISOString()}] 💓 Keep-alive ping succeeded (${response.status} OK) -> ${url}`
      );
    } else {
      console.warn(
        `[${new Date().toISOString()}] ⚠️ Keep-alive ping returned status ${response.status} -> ${url}`
      );
    }
  } catch (err: any) {
    console.warn(
      `[${new Date().toISOString()}] ⚠️ Keep-alive ping failed: ${err.message}`
    );
  }
}
