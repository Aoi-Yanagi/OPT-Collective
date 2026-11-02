import {
  PaymentStatus,
  FulfillmentStatus,
  PaymentUiPresentationState,
} from '@/types/order-lifecycle.types';

const ALLOWED_PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  NOT_STARTED: ['QR_READY'],
  QR_READY: ['AWAITING_PAYMENT', 'QR_EXPIRED'],
  AWAITING_PAYMENT: ['VERIFICATION_PENDING', 'QR_EXPIRED'],
  VERIFICATION_PENDING: [
    'CONFIRMED',
    'UNDER_REVIEW',
    'PAYMENT_REJECTED',
    'VERIFICATION_ERROR',
  ],
  UNDER_REVIEW: ['CONFIRMED', 'PAYMENT_REJECTED', 'VERIFICATION_ERROR'],
  VERIFICATION_ERROR: ['VERIFICATION_PENDING', 'UNDER_REVIEW', 'CONFIRMED'],
  QR_EXPIRED: ['QR_READY'],
  PAYMENT_REJECTED: ['QR_READY', 'UNDER_REVIEW'],
  CONFIRMED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
};

const ALLOWED_FULFILLMENT_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  NOT_STARTED: ['READY_FOR_MERCHANT', 'CANCELLED'],
  READY_FOR_MERCHANT: ['SUPPLIER_ORDER_PENDING', 'BLOCKED', 'CANCELLED'],
  SUPPLIER_ORDER_PENDING: ['SUPPLIER_ORDER_PLACED', 'BLOCKED', 'CANCELLED'],
  SUPPLIER_ORDER_PLACED: ['DISPATCHED', 'SHIPPED', 'BLOCKED'],
  DISPATCHED: ['SHIPPED', 'DELIVERED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  BLOCKED: ['READY_FOR_MERCHANT', 'SUPPLIER_ORDER_PENDING', 'CANCELLED'],
  CANCELLED: [],
};

export function canTransitionPayment(
  current: PaymentStatus,
  next: PaymentStatus
): boolean {
  if (current === next) return true;
  return ALLOWED_PAYMENT_TRANSITIONS[current]?.includes(next) ?? false;
}

export function canTransitionFulfillment(
  current: FulfillmentStatus,
  next: FulfillmentStatus,
  paymentStatus: PaymentStatus
): boolean {
  if (next !== 'NOT_STARTED' && next !== 'CANCELLED' && paymentStatus !== 'CONFIRMED') {
    return false; // Cannot enter merchant fulfillment queue before payment confirmation
  }
  if (current === next) return true;
  return ALLOWED_FULFILLMENT_TRANSITIONS[current]?.includes(next) ?? false;
}

export function mapPaymentStatusToUiState(
  status: PaymentStatus
): PaymentUiPresentationState {
  switch (status) {
    case 'NOT_STARTED':
      return 'PREPARING_QR';
    case 'QR_READY':
      return 'QR_AVAILABLE';
    case 'AWAITING_PAYMENT':
      return 'WAITING_FOR_PAYMENT';
    case 'VERIFICATION_PENDING':
      return 'VERIFICATION_IN_PROGRESS';
    case 'CONFIRMED':
      return 'PAYMENT_CONFIRMED';
    case 'PAYMENT_REJECTED':
      return 'PAYMENT_NOT_CONFIRMED';
    case 'VERIFICATION_ERROR':
      return 'VERIFICATION_TEMPORARILY_UNAVAILABLE';
    case 'QR_EXPIRED':
      return 'QR_EXPIRED';
    case 'UNDER_REVIEW':
    default:
      return 'MANUAL_REVIEW_REQUIRED';
  }
}

/**
 * Masks customer name to protect privacy on tracking pages:
 * e.g., "Aarav Sharma" -> "A***v S****a"
 */
export function maskCustomerName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part: string) => {
      if (part.length <= 2) return part[0] + '*';
      return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
    })
    .join(' ');
}

/**
 * Maps internal dual states to the 7 customer-facing tracking stages in revised.pdf Section 5.
 */
export function getCustomerTrackingTimeline(
  paymentStatus: PaymentStatus,
  fulfillmentStatus: FulfillmentStatus
): { step: number; label: string; completed: boolean; current: boolean }[] {
  const isConfirmed = paymentStatus === 'CONFIRMED';
  const stages = [
    {
      step: 1,
      label: 'Order received',
      completed: true,
    },
    {
      step: 2,
      label: 'Payment verification',
      completed:
        isConfirmed ||
        paymentStatus === 'VERIFICATION_PENDING' ||
        paymentStatus === 'UNDER_REVIEW',
    },
    {
      step: 3,
      label: 'Payment confirmed',
      completed: isConfirmed,
    },
    {
      step: 4,
      label: 'Order preparation',
      completed:
        isConfirmed &&
        [
          'READY_FOR_MERCHANT',
          'SUPPLIER_ORDER_PENDING',
          'SUPPLIER_ORDER_PLACED',
          'DISPATCHED',
          'SHIPPED',
          'DELIVERED',
        ].includes(fulfillmentStatus),
    },
    {
      step: 5,
      label: 'Supplier order placed',
      completed:
        isConfirmed &&
        ['SUPPLIER_ORDER_PLACED', 'DISPATCHED', 'SHIPPED', 'DELIVERED'].includes(
          fulfillmentStatus
        ),
    },
    {
      step: 6,
      label: 'Shipment dispatched',
      completed:
        isConfirmed &&
        ['DISPATCHED', 'SHIPPED', 'DELIVERED'].includes(fulfillmentStatus),
    },
    {
      step: 7,
      label: 'Delivered',
      completed: isConfirmed && fulfillmentStatus === 'DELIVERED',
    },
  ];

  let lastCompletedIdx = -1;
  stages.forEach((s, idx) => {
    if (s.completed) lastCompletedIdx = idx;
  });

  return stages.map((s, idx) => ({
    ...s,
    current: idx === lastCompletedIdx,
  }));
}