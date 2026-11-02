export type BotNotificationChannel =
  | 'BUSINESS_OVERVIEW'
  | 'REVENUE_PROFIT'
  | 'ORDERS_INTAKE'
  | 'PAYMENT_VERIFICATION'
  | 'FULFILLMENT_OPS'
  | 'CUSTOMER_LEADS'
  | 'WEBSITE_MONITORING'
  | 'SEO_TRAFFIC'
  | 'SOCIAL_MEDIA'
  | 'ADVERTISING_AFFILIATE'
  | 'TASK_MANAGEMENT'
  | 'SECURITY_ALERT'
  | 'CATALOG_WAITLIST'
  | 'VIRAL_TREND_SCOUT'
  | 'BLOG_SEO_SYNDICATION';

export interface BotNotificationEvent {
  channel: BotNotificationChannel;
  title: string;
  orderReference?: string;
  lines: string[];
  timestampIso?: string;
}

const CHANNEL_CHAT_ID_ENV: Record<BotNotificationChannel, string | undefined> = {
  BUSINESS_OVERVIEW:
    process.env.TELEGRAM_CHAT_ID_OVERVIEW || process.env.TELEGRAM_ADMIN_CHAT_ID,
  REVENUE_PROFIT:
    process.env.TELEGRAM_CHAT_ID_PROFIT || process.env.TELEGRAM_ADMIN_CHAT_ID,
  ORDERS_INTAKE:
    process.env.TELEGRAM_CHAT_ID_ORDERS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  PAYMENT_VERIFICATION:
    process.env.TELEGRAM_CHAT_ID_PAYMENTS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  FULFILLMENT_OPS:
    process.env.TELEGRAM_CHAT_ID_FULFILLMENT || process.env.TELEGRAM_ADMIN_CHAT_ID,
  CUSTOMER_LEADS:
    process.env.TELEGRAM_CHAT_ID_LEADS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  WEBSITE_MONITORING:
    process.env.TELEGRAM_CHAT_ID_MONITOR || process.env.TELEGRAM_ADMIN_CHAT_ID,
  SEO_TRAFFIC:
    process.env.TELEGRAM_CHAT_ID_SEO || process.env.TELEGRAM_ADMIN_CHAT_ID,
  SOCIAL_MEDIA:
    process.env.TELEGRAM_CHAT_ID_SOCIAL || process.env.TELEGRAM_ADMIN_CHAT_ID,
  ADVERTISING_AFFILIATE:
    process.env.TELEGRAM_CHAT_ID_ADS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  TASK_MANAGEMENT:
    process.env.TELEGRAM_CHAT_ID_TASKS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  SECURITY_ALERT:
    process.env.TELEGRAM_CHAT_ID_SECURITY || process.env.TELEGRAM_ADMIN_CHAT_ID,
  CATALOG_WAITLIST:
    process.env.TELEGRAM_CHAT_ID_CATALOG || process.env.TELEGRAM_ADMIN_CHAT_ID,
  VIRAL_TREND_SCOUT:
    process.env.TELEGRAM_CHAT_ID_TRENDS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  BLOG_SEO_SYNDICATION:
    process.env.TELEGRAM_CHAT_ID_BLOGS || process.env.TELEGRAM_ADMIN_CHAT_ID,
};

/**
 * Dispatches structured operational notifications to the 12-Bot Telegram Ecosystem
 * and optional Google Sheets webhook without blocking customer or admin actions.
 */
export async function dispatchMultiBotNotification(
  event: BotNotificationEvent
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = CHANNEL_CHAT_ID_ENV[event.channel];
  const timestamp =
    event.timestampIso ||
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const formattedMessage = [
    `📡 *[${event.channel}] ${event.title}*`,
    event.orderReference ? `Ref: \`${event.orderReference}\`` : null,
    ...event.lines.map((l: string) => `• ${l}`),
    `🕒 _${timestamp}_`,
  ]
    .filter(Boolean)
    .join('\n');

  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'Markdown',
      }),
    }).catch(() => null);
  }

  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: event.channel,
        title: event.title,
        orderReference: event.orderReference || '',
        details: event.lines.join(' | '),
        timestamp,
      }),
    }).catch(() => null);
  }
}