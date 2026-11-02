export type BotNotificationChannel =
  | 'ORDERS_INTAKE'
  | 'PAYMENT_VERIFICATION'
  | 'FULFILLMENT_OPS'
  | 'CATALOG_WAITLIST';

export interface BotNotificationEvent {
  channel: BotNotificationChannel;
  title: string;
  orderReference?: string;
  lines: string[];
  timestampIso?: string;
}

const CHANNEL_CHAT_ID_ENV: Record<BotNotificationChannel, string | undefined> = {
  ORDERS_INTAKE: process.env.TELEGRAM_CHAT_ID_ORDERS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  PAYMENT_VERIFICATION:
    process.env.TELEGRAM_CHAT_ID_PAYMENTS || process.env.TELEGRAM_ADMIN_CHAT_ID,
  FULFILLMENT_OPS:
    process.env.TELEGRAM_CHAT_ID_FULFILLMENT || process.env.TELEGRAM_ADMIN_CHAT_ID,
  CATALOG_WAITLIST:
    process.env.TELEGRAM_CHAT_ID_CATALOG || process.env.TELEGRAM_ADMIN_CHAT_ID,
};

/**
 * Dispatches structured operational notifications to dedicated Telegram Bot channels
 * and optional Google Sheets webhook without blocking customer responses.
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