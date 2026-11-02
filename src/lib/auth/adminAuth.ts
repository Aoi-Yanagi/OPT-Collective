import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'opt_merchant_session';

/**
 * Verifies if the current server request carries a valid Merchant Admin session.
 * Set OPT_ADMIN_ACCESS_KEY in your .env.local / Vercel Environment Variables.
 */
export async function isMerchantAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const configuredSecret = process.env.OPT_ADMIN_ACCESS_KEY || 'opt-local-dev-key-2026';

  if (!sessionCookie) return false;
  return sessionCookie === configuredSecret;
}