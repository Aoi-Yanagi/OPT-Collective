import { OrderRecord } from '@/types/order-lifecycle.types';

// Server-side durable store (bridges to Supabase `public.orders` when env keys are active)
const SERVER_ORDER_LEDGER = new Map<string, OrderRecord>();

// Seed 1 clearly labelled fictional demo order for testing tracking & admin fulfillment
const DEMO_ORDER: OrderRecord = {
  orderReference: 'OPT-2026-DEMO-9012',
  lookupToken: 'tok-demo-9012',
  createdAtIso: '2026-10-31T10:30:00.000Z',
  updatedAtIso: '2026-10-31T10:45:00.000Z',
  delivery: {
    fullName: '[DEMO] Vikramaditya Rao',
    mobileNumber: '9000000000',
    email: 'demo.buyer@example.com',
    addressLine: 'Demo Tech Park, Unit 4B, Hazratganj',
    apartmentOrLandmark: 'Near Metro Gate 2',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    deliveryInstructions: 'Leave at security desk',
  },
  maskedCustomerName: 'V**********a R*o',
  itemsSnapshot: [
    {
      productId: 'prod-desk-01',
      sku: 'OPT-DESK-001',
      slug: 'aerolift-6-axis-aluminum-riser',
      title: 'AeroLift 6-Axis Aluminum Laptop Riser',
      selectedVariant: 'Obsidian Matte',
      quantity: 1,
      unitPriceInr: 599,
      lineTotalInr: 599,
      image:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
    },
  ],
  subtotalInr: 599,
  deliveryChargeInr: 0,
  discountInr: 0,
  payableAmountInr: '599.42',
  paymentStatus: 'CONFIRMED',
  fulfillmentStatus: 'READY_FOR_MERCHANT',
  confirmedPaymentReference: 'DEMO-UTR-430411009988',
  receiptNumber: 'RCPT-OPT-2026-9012',
  paymentConfirmedAtIso: '2026-10-31T10:45:00.000Z',
  eventHistory: [
    {
      timestampIso: '2026-10-31T10:30:00.000Z',
      statusLabel: 'QR_READY',
      note: 'Durable order snapshot created at Stage 2.',
    },
    {
      timestampIso: '2026-10-31T10:45:00.000Z',
      statusLabel: 'CONFIRMED',
      note: '[DEMO] Authoritative payment verification confirmed.',
    },
  ],
};

SERVER_ORDER_LEDGER.set(DEMO_ORDER.orderReference, DEMO_ORDER);

export function saveServerOrder(order: OrderRecord): OrderRecord {
  SERVER_ORDER_LEDGER.set(order.orderReference, order);
  return order;
}

export function getServerOrderByRef(orderReference: string): OrderRecord | undefined {
  return SERVER_ORDER_LEDGER.get(orderReference.trim().toUpperCase());
}

export function listAllServerOrders(): OrderRecord[] {
  return Array.from(SERVER_ORDER_LEDGER.values()).sort((a, b) =>
    b.createdAtIso.localeCompare(a.createdAtIso)
  );
}