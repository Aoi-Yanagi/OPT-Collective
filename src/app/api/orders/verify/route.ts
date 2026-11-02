import { NextRequest, NextResponse } from 'next/server';
import { OrderSubmissionPayload, ConfirmedOrderReceipt } from '@/types/checkout.types';
import { buildWhatsAppOrderLink } from '@/lib/upi';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderSubmissionPayload;

    if (!body.customerName || !body.phone || !body.address || !body.pincode) {
      return NextResponse.json(
        { error: 'Please complete your name, WhatsApp number, delivery address, and Pin Code.' },
        { status: 400 }
      );
    }

    if (!body.forensicsPassed) {
      return NextResponse.json(
        { error: 'Payment verification failed forensic authenticity checks.' },
        { status: 422 }
      );
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `OPT-2026-${randomDigits}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const itemsSummary = body.items.map((i) => `${i.sku} (x${i.quantity})`).join(', ');

    // 1. Optional: Send Instant Alert to Your Private Telegram Admin Bot
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
      const telegramText = [
        `🛡️ *NEW PREPAID ORDER: ${orderId}*`,
        `• *Buyer:* ${body.customerName} (${body.phone})`,
        `• *Email:* ${body.email || 'N/A'}`,
        `• *Amount:* ₹${body.exactPaisaAmount}`,
        `• *Method:* ${body.verificationMethod}`,
        `• *UTR:* \`${body.utrNumber}\``,
        `• *Items:* ${itemsSummary}`,
        `• *Address:* ${body.address} - ${body.pincode}`,
      ].join('\n');

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
          text: telegramText,
          parse_mode: 'Markdown',
        }),
      }).catch(() => null);
    }

    // 2. Optional: Forward to Google Sheets Apps Script Webhook (Ledger + Auto Email Receipt)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          timestamp,
          ...body,
          itemsSummary,
        }),
      }).catch(() => null);
    }

    const receipt: ConfirmedOrderReceipt = {
      orderId,
      timestamp,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      address: body.address,
      pincode: body.pincode,
      exactAmountPaid: body.exactPaisaAmount,
      utrNumber: body.utrNumber,
      verificationBadge:
        body.verificationMethod === 'METHOD_B_PAISA_LOCK'
          ? 'Verified via Unique .XX Paisa Lock'
          : 'Verified via AI Receipt Forensics & OCR',
      whatsappConfirmUrl: buildWhatsAppOrderLink({
        merchantWhatsAppNumber: process.env.NEXT_PUBLIC_MERCHANT_WHATSAPP || '919876543210',
        orderId,
        customerName: body.customerName,
        exactAmount: body.exactPaisaAmount,
        utrNumber: body.utrNumber,
        itemsSummary,
      }),
    };

    return NextResponse.json({ ok: true, receipt });
  } catch {
    return NextResponse.json({ error: 'Order processing error.' }, { status: 500 });
  }
}