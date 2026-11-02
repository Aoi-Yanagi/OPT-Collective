export type PaymentStatus =
  | 'NOT_STARTED'
  | 'QR_READY'
  | 'AWAITING_PAYMENT'
  | 'VERIFICATION_PENDING'
  | 'UNDER_REVIEW'
  | 'CONFIRMED'
  | 'PAYMENT_REJECTED'
  | 'QR_EXPIRED'
  | 'VERIFICATION_ERROR'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type FulfillmentStatus =
  | 'NOT_STARTED'
  | 'READY_FOR_MERCHANT'
  | 'SUPPLIER_ORDER_PENDING'
  | 'SUPPLIER_ORDER_PLACED'
  | 'DISPATCHED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'BLOCKED'
  | 'CANCELLED';

export type PaymentUiPresentationState =
  | 'PREPARING_QR'
  | 'QR_AVAILABLE'
  | 'WAITING_FOR_PAYMENT'
  | 'VERIFICATION_IN_PROGRESS'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_NOT_CONFIRMED'
  | 'VERIFICATION_TEMPORARILY_UNAVAILABLE'
  | 'QR_EXPIRED'
  | 'MANUAL_REVIEW_REQUIRED';

export interface OrderLineSnapshot {
  productId: string;
  sku: string;
  slug: string;
  title: string;
  selectedVariant: string;
  quantity: number;
  unitPriceInr: number;
  lineTotalInr: number;
  image: string;
}

export interface CustomerDeliveryDetails {
  fullName: string;
  mobileNumber: string;
  email?: string;
  addressLine: string;
  apartmentOrLandmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions?: string;
}

export interface PaymentSession {
  paymentSessionId: string;
  orderReference: string;
  payableAmountInr: string;
  currency: 'INR';
  qrAssetSvgOrUrl: string;
  merchantDisplayName: string;
  merchantVpaMasked: string;
  expiresAtIso: string;
  integrationConfigured: boolean;
}

export interface PaymentVerificationResult {
  orderReference: string;
  paymentSessionId: string;
  verdict: 'CONFIRMED' | 'PENDING' | 'REJECTED' | 'TECHNICAL_ERROR' | 'REVIEW_REQUIRED';
  paymentStatus: PaymentStatus;
  uiState: PaymentUiPresentationState;
  message: string;
  confirmedPaymentReference?: string;
  verifiedAtIso?: string;
}

export interface OrderRecord {
  orderReference: string;
  lookupToken: string;
  createdAtIso: string;
  updatedAtIso: string;
  delivery: CustomerDeliveryDetails;
  maskedCustomerName: string; // e.g., "A***v S****a" for privacy-safe tracking
  itemsSnapshot: OrderLineSnapshot[];
  subtotalInr: number;
  deliveryChargeInr: number;
  discountInr: number;
  payableAmountInr: string; // Includes unique paisa or exact snapshot total
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentSession?: PaymentSession;
  confirmedPaymentReference?: string;
  receiptNumber?: string;
  paymentConfirmedAtIso?: string;
  trackingId?: string;
  courierPartner?: string;
  eventHistory: { timestampIso: string; statusLabel: string; note: string }[];
}

export interface OrderAcknowledgement {
  type: 'PRE_PAYMENT_ACKNOWLEDGEMENT';
  orderReference: string;
  createdAtIso: string;
  items: OrderLineSnapshot[];
  payableAmountInr: string;
  deliverySummary: string;
  paymentStatus: PaymentStatus;
}

export interface OfficialPaymentReceipt {
  type: 'CONFIRMED_PAYMENT_RECEIPT';
  receiptNumber: string;
  orderReference: string;
  paymentConfirmedAtIso: string;
  confirmedPaymentReference: string;
  customerName: string;
  deliveryCityStatePin: string;
  items: OrderLineSnapshot[];
  totalPaidInr: string;
  verificationStatusLabel: string;
  disclaimer: string;
}