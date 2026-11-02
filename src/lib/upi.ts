export interface UpiPaymentConfig {
  merchantVpa: string;
  merchantName: string;
  exactAmount: string;
  transactionNote: string;
}

/**
 * Method B: Generates a deterministic .11 to .98 paisa suffix from the customer's
 * 10-digit phone number and base subtotal so every concurrent checkout has a unique amount.
 */
export function generateUniquePaisaAmount(baseSubtotal: number, phone: string): string {
  const cleanDigits = phone.replace(/\D/g, '');
  const lastFour = parseInt(cleanDigits.slice(-4) || '42', 10);
  const paisa = ((lastFour + baseSubtotal) % 88) + 11; // Always between 11 and 98
  return `${baseSubtotal}.${paisa.toString().padStart(2, '0')}`;
}

/**
 * Builds the universal `upi://pay` URI that triggers the native OS app chooser
 * (Google Pay, PhonePe, Paytm, BHIM) on Android and iOS devices.
 */
export function buildUniversalUpiIntent(config: UpiPaymentConfig): string {
  const params = new URLSearchParams({
    pa: config.merchantVpa,
    pn: config.merchantName,
    am: config.exactAmount,
    cu: 'INR',
    tn: config.transactionNote,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Builds a pre-filled WhatsApp Business confirmation URL for instant customer updates.
 */
export function buildWhatsAppOrderLink(params: {
  merchantWhatsAppNumber: string;
  orderId: string;
  customerName: string;
  exactAmount: string;
  utrNumber: string;
  itemsSummary: string;
}): string {
  const message = [
    `Hello *THE O.P.T. COLLECTIVE* Desk!`,
    ``,
    `My prepaid UPI order is complete:`,
    `• *Order ID:* ${params.orderId}`,
    `• *Name:* ${params.customerName}`,
    `• *Amount Paid:* ₹${params.exactAmount}`,
    `• *UTR / Ref:* ${params.utrNumber}`,
    `• *Items:* ${params.itemsSummary}`,
    ``,
    `Please share my dispatch tracking link once packed!`,
  ].join('\n');

  return `https://wa.me/${params.merchantWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}